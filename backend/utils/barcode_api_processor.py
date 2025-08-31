#!/usr/bin/env python3
import requests
import json
import re
import time
import logging
import os
import sys
import pickle
import tempfile
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger('barcode_api_processor')

# Constants (copied from your original constants.py)
LOG_LEVEL = logging.INFO
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
DEFAULT_API_REQUEST_DELAY = 1.0
DEFAULT_MAX_RETRIES = 5
OPENFOODFACTS_BASE_URL = "https://world.openfoodfacts.org/api/v0/product/"
GOOGLE_SEARCH_API_URL = "https://www.googleapis.com/customsearch/v1"
DIGITEYES_API_URL = "https://www.digiteyes.net/barcode/search.php"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

VALID_BARCODE_LENGTHS = [8, 12, 13, 14]
GEMINI_MODEL = "gemini-1.5-flash-latest"
OPENAI_MODEL = "gpt-3.5-turbo"
DEEPSEEK_MODEL = "deepseek-chat"
AI_TEMPERATURE = 0.3
GEMINI_MAX_TOKENS = 1000
OPENAI_MAX_TOKENS = 1000
DEEPSEEK_MAX_TOKENS = 1000

# Category keywords from your original script
CATEGORY_KEYWORDS = {
    'Food & Beverages': [
        'oil', 'spice', 'tea', 'coffee', 'biscuit', 'snack', 'drink', 'juice', 'milk', 
        'rice', 'flour', 'sugar', 'salt', 'masala', 'dal', 'lentil', 'pasta', 'noodles',
        'sauce', 'ketchup', 'pickle', 'jam', 'honey', 'chocolate', 'candy', 'cake',
        'bread', 'butter', 'cheese', 'yogurt', 'ghee', 'vinegar', 'cooking', 'edible'
    ],
    'Personal Care': [
        'soap', 'shampoo', 'cream', 'lotion', 'toothpaste', 'deodorant', 'perfume', 
        'face wash', 'body wash', 'moisturizer', 'sunscreen', 'hair oil', 'conditioner',
        'face cream', 'body cream', 'talcum', 'powder', 'gel', 'scrub', 'mask'
    ],
    'Household': [
        'detergent', 'cleaner', 'dishwash', 'toilet', 'bathroom', 'kitchen', 'cleaning', 
        'liquid', 'floor cleaner', 'glass cleaner', 'disinfectant', 'bleach', 'soap bar',
        'washing powder', 'fabric softener', 'air freshener', 'insecticide', 'mosquito'
    ],
    'Health & Medicine': [
        'tablet', 'capsule', 'syrup', 'medicine', 'vitamin', 'supplement', 'antibiotic',
        'painkiller', 'cough', 'cold', 'fever', 'antiseptic', 'bandage', 'ointment'
    ],
    'Baby Care': [
        'baby', 'infant', 'diaper', 'formula', 'powder', 'baby oil', 'baby soap',
        'baby shampoo', 'baby lotion', 'baby food', 'wipes'
    ],
    'Beauty': [
        'lipstick', 'makeup', 'foundation', 'mascara', 'nail', 'beauty', 'kajal',
        'eyeliner', 'compact', 'rouge', 'blush', 'eyeshadow'
    ]
}

SUBCATEGORY_MAP = {
    'cooking oil': 'Cooking Oil',
    'edible oil': 'Cooking Oil',
    'mustard oil': 'Cooking Oil',
    'sunflower oil': 'Cooking Oil',
    'coconut oil': 'Cooking Oil',
    'olive oil': 'Cooking Oil',
    'dishwash': 'Cleaning Products',
    'dish wash': 'Cleaning Products',
    'liquid': 'Cleaning Products',
    'detergent': 'Cleaning Products',
    'bar soap': 'Bath & Body',
    'body soap': 'Bath & Body',
    'toilet soap': 'Bath & Body',
    'face wash': 'Face Care',
    'face cream': 'Face Care',
    'shampoo': 'Hair Care',
    'hair oil': 'Hair Care',
    'conditioner': 'Hair Care',
    'toothpaste': 'Oral Care',
    'mouthwash': 'Oral Care',
    'spice': 'Spices & Seasonings',
    'masala': 'Spices & Seasonings',
    'tea': 'Beverages',
    'coffee': 'Beverages',
    'juice': 'Beverages'
}

INDIA_COMPANY_CODES = {
    '890': 'India',
    '891': 'India', 
    '892': 'India',
    '893': 'India',
    '894': 'India',
    '895': 'India'
}

BARCODE_CATEGORY_PATTERNS = {
    "2102163": {"category": "Household", "subcategory": "Cleaning"},
    "2102127": {"category": "Household", "subcategory": "Kitchen"},
    "2102160": {"category": "Food", "subcategory": "Oils"},
    "8901030": {"category": "Personal Care", "subcategory": "Bath & Body"},
    "8901194": {"category": "Food & Beverages", "subcategory": "Snacks"},
    # Add more patterns as needed
}

QUANTITY_PATTERNS = [
    r'(\d+(?:\.\d+)?)\s*g\b',
    r'(\d+(?:\.\d+)?)\s*gm\b', 
    r'(\d+(?:\.\d+)?)\s*gram\b',
    r'(\d+(?:\.\d+)?)\s*kg\b',
    r'(\d+(?:\.\d+)?)\s*ml\b',
    r'(\d+(?:\.\d+)?)\s*l\b',
    r'(\d+(?:\.\d+)?)\s*liter\b',
    r'(\d+(?:\.\d+)?)\s*pc\b',
    r'(\d+(?:\.\d+)?)\s*piece\b',
    r'(\d+(?:\.\d+)?)\s*pack\b',
    r'(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*(g|gm|ml|l|kg)',  # For "2 x 500g" format
    r'(\d+(?:\.\d+)?)\s*Gm\b',  # Capital Gm
]

AI_SERVICE_DEFAULT_STATUS = {
    "gemini": {"working": True, "failures": 0},
    "openai": {"working": True, "failures": 0},
    "deepseek": {"working": True, "failures": 0}
}

AI_ENHANCEMENT_PROMPT_TEMPLATE = """
Analyze this product data for barcode {barcode} and enhance it with accurate information:

Context Data:
{context}

Please return ONLY a valid JSON object with this exact structure:
{{
    "Product Name": "accurate product name",
    "Brand": "brand name",
    "Description": "detailed product description",
    "Category": "main category (Food & Beverages, Personal Care, Household, Health & Medicine, Baby Care, Beauty, Other)",
    "Subcategory": "specific subcategory",
    "ProductLine": "brand + subcategory combination",
    "Quantity": numeric_value,
    "Unit": "g/ml/kg/l/pc",
    "Features": ["feature1", "feature2", "feature3", "feature4"],
    "Specification": {{
        "Brand": "brand name",
        "Weight/Volume": "quantity with unit",
        "Country of Origin": "country",
        "Barcode Type": "EAN-13/UPC-A/etc",
        "Ingredients": "ingredient list if available",
        "Nutrition Facts": "nutrition information if available"
    }}
}}

Guidelines:
1. Extract accurate product name, brand, and description
2. Categorize appropriately based on product type
3. Determine realistic quantity and unit
4. Generate relevant features based on product category
5. Include comprehensive specifications
6. Ensure all JSON is properly formatted

Return only the JSON object, no other text.
"""

# JSON parsing patterns
JSON_CODEBLOCK_PATTERN = r'```(?:json)?\s*(\{.*?\})\s*```'
JSON_UNQUOTED_PROPERTY_PATTERN = r'(\s*)([a-zA-Z_][a-zA-Z0-9_\s]*)\s*:'
JSON_TRAILING_COMMA_PATTERN = r',(\s*[}\]])'
JSON_MISSING_COMMA_PATTERN = r'(\}\s*)(\s*"[^"]*"\s*:)'
JSON_UNQUOTED_VALUE_PATTERN = r':\s*([^",\[\{\s][^",\[\{]*[^",\[\}\s])\s*([,\}])'
JSON_MAX_CLEANUP_ATTEMPTS = 3

class BarcodeAPIProcessor:
    """Complete barcode processor for Node.js API integration - preserving all original functionality."""
    
    def __init__(self, output_dir: str = None):
        """Initialize the barcode processor with API keys from environment."""
        # Load environment variables
        load_dotenv()
        
        # Use temp directory if no output directory specified
        self.output_dir = output_dir or tempfile.mkdtemp(prefix='barcode_processor_')
        self.temp_dir = self.output_dir if not output_dir else None
        
        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)
        
        # API Keys from environment variables
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.google_cx = os.getenv("GOOGLE_SEARCH_CX")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
        self.digiteyes_app_key = os.getenv("DIGITEYES_APP_KEY")
        self.digiteyes_signature = os.getenv("DIGITEYES_SIGNATURE")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        
        # Configuration
        self.api_request_delay = float(os.getenv("API_REQUEST_DELAY", str(DEFAULT_API_REQUEST_DELAY)))
        self.max_retries = int(os.getenv("MAX_RETRIES", str(DEFAULT_MAX_RETRIES)))
        self.openfoodfacts_url = os.getenv("OPENFOODFACTS_URL", OPENFOODFACTS_BASE_URL)
        self.stop_requested = False
        
        # Add local cache for Google search results
        self.search_cache_dir = os.path.join(self.output_dir, 'cache')
        os.makedirs(self.search_cache_dir, exist_ok=True)
        
        # Track processed items
        self.last_processed_item = None
        self.processed_barcodes = []
        
        # AI failure tracking - set Gemini as the primary service
        self.ai_service_status = AI_SERVICE_DEFAULT_STATUS.copy()
        
        # Added failover info for common Indian product companies
        self.india_company_codes = INDIA_COMPANY_CODES
        
        # Common product categories by barcode patterns
        self.barcode_category_patterns = BARCODE_CATEGORY_PATTERNS
        
        logger.info("Barcode API processor initialized with all original functionality")
        
        # Verify API keys are loaded
        self._check_api_keys()

    def _check_api_keys(self):
        """Verify API keys are loaded and log warnings for missing keys."""
        missing_keys = []
        
        if not self.google_api_key:
            missing_keys.append("GOOGLE_API_KEY")
        if not self.google_cx:
            missing_keys.append("GOOGLE_SEARCH_CX")
        if not self.openai_api_key:
            missing_keys.append("OPENAI_API_KEY")
        if not self.gemini_api_key:
            missing_keys.append("GEMINI_API_KEY")
        if not self.deepseek_api_key:
            missing_keys.append("DEEPSEEK_API_KEY")
        if not self.digiteyes_app_key:
            missing_keys.append("DIGITEYES_APP_KEY")
        if not self.digiteyes_signature:
            missing_keys.append("DIGITEYES_SIGNATURE")
        
        if missing_keys:
            logger.warning(f"Missing environment variables: {', '.join(missing_keys)}")
            logger.warning("Some API services may not function correctly. Please check your .env file.")
        else:
            logger.info("All required API keys loaded successfully.")

    def process_barcodes(self, barcodes: List[str]) -> List[Dict]:
        """
        Process a list of barcodes and return product data.
        
        Args:
            barcodes: List of barcode strings
            
        Returns:
            List of product data dictionaries
        """
        results = []
        
        logger.info(f"Starting to process {len(barcodes)} barcodes")
        
        for i, barcode in enumerate(barcodes, 1):
            try:
                logger.info(f"Processing barcode {i}/{len(barcodes)}: {barcode}")
                
                # Validate barcode format
                if not self._is_valid_barcode(barcode):
                    logger.warning(f"Invalid barcode format: {barcode}")
                    continue
                
                # Process single barcode
                product_data = self._process_single_barcode(barcode)
                
                if product_data:
                    results.append(product_data)
                    self.last_processed_item = product_data
                    self.processed_barcodes.append(barcode)
                    logger.info(f"Successfully processed barcode: {barcode}")
                else:
                    logger.warning(f"No data found for barcode: {barcode}")
                    
                # Small delay between requests to respect rate limits
                time.sleep(self.api_request_delay)
                
            except Exception as e:
                logger.error(f"Error processing barcode {barcode}: {e}")
                continue
        
        logger.info(f"Completed processing. Found data for {len(results)} out of {len(barcodes)} barcodes")
        return results

    def _process_single_barcode(self, barcode: str) -> Optional[Dict]:
        """Process a single barcode and return the product data - preserving original logic."""
        logger.info(f"Processing barcode: {barcode}")
    
        # First try OpenFoodFacts
        product_data = self._search_openfoodfacts(barcode)
        failure_reasons = []
    
        # If not found, try Google Search
        if not product_data or not product_data.get('name'):
            logger.info(f"No data found in OpenFoodFacts, trying Google for: {barcode}")
            failure_reasons.append("Not found in OpenFoodFacts")
            product_data = self._search_google(barcode)
    
        # If not found, try DigiTeyes API
        if not product_data or not product_data.get('name'):
            logger.info(f"No data found in Google, trying DigiTeyes for: {barcode}")
            failure_reasons.append("Not found in Google Search")
            product_data = self._search_digiteyes(barcode)
    
        # If we have data, enhance it with AI
        if product_data and product_data.get('name'):
            logger.info(f"Found product data: {product_data.get('name')}")
            product_data = self._enhance_with_ai(product_data, barcode)
            return product_data
        else:
            logger.warning(f"No product information found for barcode: {barcode}")
            failure_reasons.append("Not found in DigiTeyes")
            return None

    def _is_valid_barcode(self, barcode: str) -> bool:
        """Check if barcode has a valid format - preserving original logic."""
        barcode = str(barcode).strip()
        
        # First check: must be all digits
        if not barcode.isdigit():
            logger.warning(f"Invalid barcode (non-digits): {barcode}")
            return False
            
        # Second check: must be of valid length
        if len(barcode) not in VALID_BARCODE_LENGTHS:
            logger.warning(f"Invalid barcode (wrong length): {barcode}")
            return False
        
        return True

    def _search_openfoodfacts(self, barcode: str) -> Optional[Dict]:
        """Search for barcode in OpenFoodFacts - preserving original logic."""
        try:
            url = f"{self.openfoodfacts_url}{barcode}.json"
            response = requests.get(url, timeout=10)
            data = response.json()
            
            if data.get('status') == 1 and 'product' in data:
                product = data['product']
                
                # Extract relevant information
                product_data = {
                    'name': product.get('product_name', ''),
                    'brand': product.get('brands', ''),
                    'description': product.get('generic_name', ''),
                    'ingredients': product.get('ingredients_text', ''),
                    'image_url': product.get('image_url', ''),
                    'quantity': product.get('quantity', ''),
                    'source': 'OpenFoodFacts'
                }
                
                # Try to extract numbers from quantity
                if product_data['quantity']:
                    qty_match = re.search(r'(\d+(?:\.\d+)?)\s*(g|ml|l|kg)', product_data['quantity'].lower())
                    if qty_match:
                        product_data['quantity_value'] = float(qty_match.group(1))
                        product_data['quantity_unit'] = qty_match.group(2)
                
                return product_data
            return None
        except Exception as e:
            logger.error(f"Error in OpenFoodFacts search: {e}")
            return None

    def _search_google(self, barcode: str) -> Optional[Dict]:
        """Search for barcode on Google using Google Custom Search API - preserving original logic."""
        try:
            if not self.google_api_key or not self.google_cx:
                logger.warning("Google API credentials not available")
                return None
            
            # First try a direct search for the barcode
            query = f"{barcode} product"
            
            # Use Google Custom Search API
            url = GOOGLE_SEARCH_API_URL
            params = {
                "key": self.google_api_key,
                "cx": self.google_cx,
                "q": query,
                "num": 10
            }
            
            logger.info(f"Searching Google for: {query}")
            
            # Add retries for API calls
            for attempt in range(self.max_retries):
                try:
                    response = requests.get(url, params=params, timeout=15)
                    if response.status_code == 200:
                        break
                    elif response.status_code == 429:  # Rate limit
                        wait_time = (attempt + 1) * 5
                        logger.warning(f"Google API rate limit hit, waiting {wait_time} seconds")
                        time.sleep(wait_time)
                    else:
                        logger.warning(f"Google API error: {response.status_code} - {response.text}")
                        break
                except requests.exceptions.RequestException as e:
                    logger.warning(f"Request failed: {e}")
                    time.sleep(1)
            
            if response.status_code != 200:
                logger.error(f"Google API error after retries: {response.status_code} - {response.text}")
                return None
                
            data = response.json()
            time.sleep(self.api_request_delay)  # Respect rate limits
            
            # Extract search results
            search_results = []
            product_data = {'source': 'Google Search'}
            
            # Process items from search results
            if 'items' in data:
                for item in data['items'][:5]:  # Look at top 5 results
                    title = item.get('title', '')
                    snippet = item.get('snippet', '')
                    link = item.get('link', '')
                    
                    search_results.append({
                        'title': title,
                        'snippet': snippet,
                        'link': link
                    })
            
            # If no good results, try adding more context to the search
            if not search_results:
                logger.info(f"No good results, trying alternate search for barcode {barcode}")
                
                # Try specific phrases for Indian products
                if barcode.startswith('890'):
                    alternate_query = f"{barcode} indian product description"
                else:
                    alternate_query = f"{barcode} product details"
                    
                params['q'] = alternate_query
                
                # Retry mechanism for alternate search
                for attempt in range(self.max_retries):
                    try:
                        response = requests.get(url, params=params, timeout=15)
                        if response.status_code == 200:
                            break
                        elif response.status_code == 429:  # Rate limit
                            wait_time = (attempt + 1) * 5
                            logger.warning(f"Google API rate limit hit, waiting {wait_time} seconds")
                            time.sleep(wait_time)
                        else:
                            logger.warning(f"Google API error: {response.status_code} - {response.text}")
                            break
                    except requests.exceptions.RequestException as e:
                        logger.warning(f"Request failed: {e}")
                        time.sleep(1)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Extract from alternate search
                    if 'items' in data:
                        for item in data['items'][:5]:
                            title = item.get('title', '')
                            snippet = item.get('snippet', '')
                            link = item.get('link', '')
                            
                            search_results.append({
                                'title': title,
                                'snippet': snippet,
                                'link': link
                            })
                
                time.sleep(self.api_request_delay)  # Respect rate limits
            
            # Extract product information from search results
            if search_results:
                # Look for e-commerce sites or product listings
                ecommerce_sites = ['amazon', 'flipkart', 'bigbasket', 'grofers', 'nykaa', 
                                  'tatacliq', 'jiomart', 'walmart', 'target', 'shop']
                product_indicators = ['g', 'kg', 'ml', 'l', 'pack', 'combo', 'bar', 'bottle']
                
                # First, try to find e-commerce listings
                for result in search_results:
                    title = result['title']
                    
                    # Skip results about barcode databases or UPC listings
                    if any(term in title.lower() for term in ['upc code', 'barcode database', 'list of', 'codes beginning']):
                        continue
                    
                    # Check for e-commerce sites or product weight indicators
                    if (any(site in result['link'].lower() for site in ecommerce_sites) or
                            any(indicator in title.lower() for indicator in product_indicators)):
                        
                        # Extract product name (usually before "-" or "|")
                        if '-' in title:
                            product_name = title.split('-')[0].strip()
                        elif '|' in title:
                            product_name = title.split('|')[0].strip()
                        else:
                            product_name = title
                        
                        # Don't use very short names or names that are just "product"
                        if len(product_name.split()) >= 2 and product_name.lower() != "product":
                            product_data['name'] = product_name
                            
                            # Try to extract brand (usually first word)
                            words = product_name.split()
                            if len(words) > 1:
                                product_data['brand'] = words[0]
                            
                            # Extract description from snippet
                            product_data['description'] = result['snippet']
                            
                            # Save the URL
                            product_data['source_url'] = result['link']
                            
                            # Try to extract quantity and unit using regex
                            qty_match = re.search(r'(\d+(?:\.\d+)?)\s*(g|gm|gram|ml|l|liter|kg|pc|pack)', 
                                                 title, re.IGNORECASE)
                            if qty_match:
                                product_data['quantity_value'] = float(qty_match.group(1))
                                product_data['quantity_unit'] = qty_match.group(2).lower()
                            
                            return product_data
            
            return None
        except Exception as e:
            logger.error(f"Error in Google search: {e}")
            return None

    def _search_digiteyes(self, barcode: str) -> Optional[Dict]:
        """Search for barcode using DigiTeyes API - preserving original logic."""
        try:
            if not self.digiteyes_app_key or not self.digiteyes_signature:
                logger.warning("DigiTeyes API credentials not available")
                return None
            
            url = DIGITEYES_API_URL
            params = {
                "upcCode": barcode,
                "app_key": self.digiteyes_app_key,
                "signature": self.digiteyes_signature,
                "language": "en"
            }
            
            logger.info(f"Searching DigiTeyes for barcode: {barcode}")
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data and 'description' in data:
                    # Extract product information
                    product_data = {
                        'name': data.get('description', ''),
                        'brand': data.get('brand', ''),
                        'description': data.get('description', ''),
                        'image_url': data.get('image', ''),
                        'source': 'DigiTeyes'
                    }
                    
                    # Try to extract quantity
                    if 'packaging' in data:
                        qty_match = re.search(r'(\d+(?:\.\d+)?)\s*(g|gm|gram|ml|l|liter|kg|pc|pack)', 
                                            data['packaging'], re.IGNORECASE)
                        if qty_match:
                            product_data['quantity_value'] = float(qty_match.group(1))
                            product_data['quantity_unit'] = qty_match.group(2).lower()
                    
                    return product_data
            
            return None
        except Exception as e:
            logger.error(f"Error in DigiTeyes search: {e}")
            return None

    def clean_and_parse_json(self, text):
        """Clean and parse potentially malformed JSON from AI responses - preserving original logic."""
        # First, try to extract JSON block if embedded in other text
        json_match = re.search(JSON_CODEBLOCK_PATTERN, text, re.DOTALL)
        if json_match:
            text = json_match.group(1)
        else:
            # Try to find JSON between curly braces
            json_start = text.find('{')
            json_end = text.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                text = text[json_start:json_end]
        
        # Try direct parsing first
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass
        
        # Fix unquoted property names (the error you're specifically seeing)
        fixed_text = re.sub(JSON_UNQUOTED_PROPERTY_PATTERN, r'\1"\2":', text)
        
        # Fix trailing commas in lists and objects
        fixed_text = re.sub(JSON_TRAILING_COMMA_PATTERN, r'\1', fixed_text)
        
        # Fix missing commas between elements
        fixed_text = re.sub(JSON_MISSING_COMMA_PATTERN, r'\1,\n\2', fixed_text)
        
        # Try parsing the fixed JSON
        try:
            return json.loads(fixed_text)
        except json.JSONDecodeError:
            # If still failing, try a more aggressive approach
            # Fix single quotes to double quotes
            fixed_text = fixed_text.replace("'", '"')
            # Fix missing quotes around string values
            fixed_text = re.sub(JSON_UNQUOTED_VALUE_PATTERN, r': "\1"\2', fixed_text)
            
            try:
                return json.loads(fixed_text)
            except json.JSONDecodeError as e:
                # Last resort, log the error and return None
                logger.error(f"Failed to parse JSON after cleanup: {e}")
                logger.debug(f"Problematic text: {text}")
                return None

    def _enhance_with_ai(self, product_data: Dict, barcode: str) -> Dict:
        """Enhance product data using AI, with fallback to local processing - preserving original logic."""
        # Skip AI if all services have had multiple failures
        if (not self.ai_service_status["gemini"]["working"] and
            not self.ai_service_status["openai"]["working"] and 
            not self.ai_service_status["deepseek"]["working"]):
            logger.info("All AI services are disabled due to repeated failures, using local processing")
            return self._intelligent_format_product_data(product_data, barcode)
        
        try:
            # Prepare data for AI enhancement
            context = json.dumps(product_data, indent=2)
            
            prompt = AI_ENHANCEMENT_PROMPT_TEMPLATE.format(barcode=barcode, context=context)
            
            # Try AI enhancement with fixed error handling
            response = None
            
            # Try Gemini first (primary AI service)
            if self.ai_service_status["gemini"]["working"]:
                logger.info("Enhancing product data with Gemini API")
                response = self._call_gemini_api(prompt)
                
                # If Gemini failed 3 times in a row, mark it as not working
                if not response and self.ai_service_status["gemini"]["failures"] >= 3:
                    logger.warning("Gemini API marked as unavailable after repeated failures")
                    self.ai_service_status["gemini"]["working"] = False
            
            # If Gemini failed, try OpenAI if it's still working
            if not response and self.ai_service_status["openai"]["working"]:
                logger.info("Gemini enhancement failed, trying OpenAI")
                response = self._call_openai_api(prompt)
                
                # If OpenAI failed 3 times in a row, mark it as not working
                if not response and self.ai_service_status["openai"]["failures"] >= 3:
                    logger.warning("OpenAI API marked as unavailable after repeated failures")
                    self.ai_service_status["openai"]["working"] = False
            
            # If OpenAI failed or is marked as not working, try DeepSeek
            if not response and self.ai_service_status["deepseek"]["working"]:
                logger.info("OpenAI enhancement failed, trying DeepSeek")
                response = self._call_deepseek_api(prompt)
                
                # If DeepSeek failed 3 times in a row, mark it as not working
                if not response and self.ai_service_status["deepseek"]["failures"] >= 3:
                    logger.warning("DeepSeek API marked as unavailable after repeated failures")
                    self.ai_service_status["deepseek"]["working"] = False
            
            if response:
                try:
                    # Use the improved JSON parser (now a class method)
                    enhanced_data = self.clean_and_parse_json(response)
                    
                    if enhanced_data and 'Product Name' in enhanced_data and enhanced_data['Product Name']:
                        # Add timestamps and image info
                        enhanced_data['Product Image'] = product_data.get('image_url', '')
                        enhanced_data['Product Ingredient Image'] = product_data.get('ingredient_image', '')
                        enhanced_data['Data Source'] = 'AI Enhanced'
                        enhanced_data['Timestamp'] = datetime.now().isoformat()
                        enhanced_data['Barcode'] = barcode
                        
                        logger.info("Successfully enhanced product data with AI")
                        return enhanced_data
                except Exception as e:
                    logger.error(f"Error parsing AI response: {e}")
            
            # If AI fails, use intelligent local processing
            logger.info("AI enhancement failed, using intelligent local processing")
            return self._intelligent_format_product_data(product_data, barcode)
            
        except Exception as e:
            logger.error(f"Error enhancing product data with AI: {e}")
            return self._intelligent_format_product_data(product_data, barcode)

    def _call_gemini_api(self, prompt: str) -> Optional[str]:
        """Call Google Gemini API with updated model name - preserving original logic."""
        try:
            # Skip if this service is marked as not working
            if not self.ai_service_status["gemini"]["working"]:
                return None
            
            if not self.gemini_api_key:
                return None
            
            # Updated URL and model name
            url = GEMINI_API_URL
            params = {
                "key": self.gemini_api_key
            }
            data = {
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": AI_TEMPERATURE,
                    "maxOutputTokens": GEMINI_MAX_TOKENS
                }
            }
            
            try:
                response = requests.post(url, params=params, json=data, timeout=30)
                
                if response.status_code == 200:
                    self.ai_service_status["gemini"]["failures"] = 0
                    response_json = response.json()
                    
                    if 'candidates' in response_json and len(response_json['candidates']) > 0:
                        content = response_json['candidates'][0].get('content', {})
                        parts = content.get('parts', [])
                        if parts and 'text' in parts[0]:
                            return parts[0]['text']
                    
                    logger.warning("Unexpected response format from Gemini API")
                    self.ai_service_status["gemini"]["failures"] += 1
                    return None
                else:
                    logger.warning(f"Gemini API error: {response.status_code} - {response.text}")
                    self.ai_service_status["gemini"]["failures"] += 1
                    return None
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"Gemini request failed: {e}")
                self.ai_service_status["gemini"]["failures"] += 1
                return None
                
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            self.ai_service_status["gemini"]["failures"] += 1
            return None

    def _call_openai_api(self, prompt: str) -> Optional[str]:
        """Call OpenAI API with better error handling - preserving original logic."""
        try:
            if not self.ai_service_status["openai"]["working"]:
                return None
            
            if not self.openai_api_key:
                return None
            
            url = OPENAI_API_URL
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.openai_api_key}"
            }
            data = {
                "model": OPENAI_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a product data specialist who extracts and formats product information."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": AI_TEMPERATURE,
                "max_tokens": OPENAI_MAX_TOKENS
            }
            
            try:
                response = requests.post(url, headers=headers, json=data, timeout=30)
                
                if response.status_code == 200:
                    self.ai_service_status["openai"]["failures"] = 0
                    return response.json()["choices"][0]["message"]["content"]
                
                # Better error handling
                if response.status_code == 429:
                    error_data = response.json().get('error', {})
                    error_type = error_data.get('type', '')
                    
                    if 'insufficient_quota' in error_type:
                        logger.warning("OpenAI API quota exceeded - marking as unavailable")
                        self.ai_service_status["openai"]["working"] = False
                    else:
                        logger.warning(f"OpenAI API rate limited: {error_data.get('message', 'Unknown error')}")
                    
                    self.ai_service_status["openai"]["failures"] += 1
                    return None
                
                elif response.status_code == 401:
                    logger.error("OpenAI API authentication failed - check API key")
                    self.ai_service_status["openai"]["working"] = False
                    return None
                
                else:
                    logger.warning(f"OpenAI API error: {response.status_code} - {response.text}")
                    self.ai_service_status["openai"]["failures"] += 1
                    return None
                
            except requests.exceptions.RequestException as e:
                logger.error(f"OpenAI request failed: {e}")
                self.ai_service_status["openai"]["failures"] += 1
                return None
                
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {e}")
            self.ai_service_status["openai"]["failures"] += 1
            return None

    def _call_deepseek_api(self, prompt: str) -> Optional[str]:
        """Call DeepSeek API with better balance checking - preserving original logic."""
        try:
            if not self.ai_service_status["deepseek"]["working"]:
                return None
            
            if not self.deepseek_api_key:
                return None
                
            url = DEEPSEEK_API_URL
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.deepseek_api_key}"
            }
            data = {
                "model": DEEPSEEK_MODEL,
                "messages": [
                    {"role": "system", "content": "You are a product data specialist who extracts and formats product information."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": AI_TEMPERATURE,
                "max_tokens": DEEPSEEK_MAX_TOKENS
            }
            
            try:
                response = requests.post(url, headers=headers, json=data, timeout=30)
                
                if response.status_code == 200:
                    self.ai_service_status["deepseek"]["failures"] = 0
                    return response.json()["choices"][0]["message"]["content"]
                
                # Better error handling for payment issues
                elif response.status_code == 402:
                    logger.warning("DeepSeek API insufficient balance - marking as unavailable")
                    self.ai_service_status["deepseek"]["working"] = False
                    return None
                
                elif response.status_code == 401:
                    logger.error("DeepSeek API authentication failed - check API key")
                    self.ai_service_status["deepseek"]["working"] = False
                    return None
                
                elif response.status_code == 429:
                    logger.warning("DeepSeek API rate limited")
                    self.ai_service_status["deepseek"]["failures"] += 1
                    return None
                
                else:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                    self.ai_service_status["deepseek"]["failures"] += 1
                    return None
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"DeepSeek request failed: {e}")
                self.ai_service_status["deepseek"]["failures"] += 1
                return None
            
        except Exception as e:
            logger.error(f"Error calling DeepSeek API: {e}")
            self.ai_service_status["deepseek"]["failures"] += 1
            return None

    def _intelligent_format_product_data(self, product_data: Dict, barcode: str) -> Dict:
        """Intelligently format product data without AI, using improved pattern recognition - preserving original logic."""
        
        # Extract and clean the product name, brand, description plus any search results
        name = product_data.get('name', '').strip()
        brand = product_data.get('brand', '').strip()
        description = product_data.get('description', '').strip()
        
        # NEW: Also look for additional data from source_url or snippet
        search_text = ''
        if 'source_url' in product_data:
            search_text += product_data.get('source_url', '') + ' '
        if 'snippet' in product_data:
            search_text += product_data.get('snippet', '') + ' '
        
        # Combine all text for analysis
        full_text = f"{name} {description} {search_text}".lower()
        
        # Detect category with improved algorithm
        category = 'Other'
        subcategory = ''
        
        for cat, keywords in CATEGORY_KEYWORDS.items():
            if any(keyword in full_text for keyword in keywords):
                category = cat
                break
        
        # Detect subcategory with improved search
        for keyword, subcat in SUBCATEGORY_MAP.items():
            if keyword in full_text:
                subcategory = subcat
                break
        
        # Extract brand if not already present
        if not brand and name:
            words = name.split()
            if len(words) > 1:
                brand = words[0]
        
        # Extract quantity and unit with more comprehensive patterns
        quantity = 0
        unit = ""
        
        # Enhanced patterns for finding quantity and unit
        for pattern in QUANTITY_PATTERNS:
            # Search in full text first
            match = re.search(pattern, full_text)
            if match:
                if len(match.groups()) == 1:
                    quantity = float(match.group(1))
                    
                    # Determine unit based on pattern
                    if 'g' in pattern:
                        unit = 'g'
                    elif 'ml' in pattern:
                        unit = 'ml'
                    elif 'kg' in pattern:
                        unit = 'kg'
                    elif 'l' in pattern:
                        unit = 'l'
                    elif 'pc' in pattern or 'piece' in pattern:
                        unit = 'pc'
                        
                elif len(match.groups()) == 3:  # For patterns like "2 x 500g"
                    quantity = float(match.group(1)) * float(match.group(2))
                    unit = match.group(3)
                    
                break
        
        # If no match found, try more general numeric extraction
        if quantity == 0:
            # Look for specific numbers followed by weight units
            weight_matches = re.findall(r'(\d+)\s*(?:g|gm|gram|ml|l|kg)', full_text)
            if weight_matches:
                # Use the first found weight
                quantity = float(weight_matches[0])
                
                # Try to determine unit from context
                if f"{quantity} g" in full_text or f"{quantity}g" in full_text:
                    unit = 'g'
                elif f"{quantity} ml" in full_text or f"{quantity}ml" in full_text:
                    unit = 'ml'
                elif f"{quantity} kg" in full_text or f"{quantity}kg" in full_text:
                    unit = 'kg'
                elif f"{quantity} l" in full_text or f"{quantity}l" in full_text:
                    unit = 'l'
        
        # Look for specifically formatted weight patterns common in product listings
        if quantity == 0 and unit == "":
            # Search for weight in common formats like "500 Gm"
            weight_gm_match = re.search(r'(\d+)\s*Gm\b', full_text, re.IGNORECASE)
            if weight_gm_match:
                quantity = float(weight_gm_match.group(1))
                unit = 'g'
        
        # Generate intelligent features based on category and product info
        features = []
        
        if category == 'Personal Care':
            features.extend(['Gentle formula', 'Suitable for daily use', 'Dermatologically tested'])
            if 'soap' in full_text:
                features.extend(['Moisturizing', 'Long-lasting fragrance'])
        elif category == 'Household':
            features.extend(['Effective cleaning', 'Easy to use', 'Value for money'])
            if 'dishwash' in full_text or 'dish wash' in full_text or 'dish bar' in full_text:
                features.extend(['Cuts through grease effectively', 'Gentle on hands'])
                if 'anti-bacterial' in full_text or 'antibacterial' in full_text:
                    features.append('Anti-bacterial formula')
                if 'ginger' in full_text:
                    features.append('Ginger twist fragrance')
        elif category == 'Food & Beverages':
            features.extend(['Fresh quality', 'Nutritious', 'Ready to consume'])
            
            if 'oil' in full_text:
                features.extend(['Pure and natural', 'Rich in nutrients'])
        else:
            features.extend(['Quality product', 'Trusted brand', 'Good value'])
        
        # Create specifications
        specifications = {
            'Brand': brand,
            'Country of Origin': 'India' if barcode.startswith('890') else 'Unknown' ,
            'Barcode Type': f"{len(barcode)}-digit barcode"
        }
        
        if quantity > 0 and unit:
            specifications['Weight/Volume'] = f"{quantity} {unit}"
            specifications['Net Quantity'] = f"{quantity} {unit}"
        
        # Add category-specific specifications
        if category == 'Personal Care':
            specifications['Suitable For'] = 'All skin types'
        elif category == 'Food & Beverages':
            specifications['Storage'] = 'Store in cool, dry place'
        elif category == 'Household' and ('dishwash' in full_text or 'dish wash' in full_text):
            if 'round' in full_text:
                specifications['Form Factor'] = 'Round bar'
            if 'ginger' in full_text:
                specifications['Fragrance'] = 'Ginger twist'
        
        # Enhance the product name if it's too generic
        if len(name.split()) <= 2:  # If name is very short like "Exo Round"
            enhanced_name = name
            
            # Try to enhance with more specific details
            if 'anti-bacterial' in full_text or 'antibacterial' in full_text:
                if 'dish' not in enhanced_name.lower():
                    if 'dishwash' in full_text or 'dish wash' in full_text:
                        enhanced_name += ' Anti-Bacterial Dishwash Bar'
            
            # If still generic and we know it's a dishwashing product
            if len(enhanced_name.split()) <= 2 and 'dishwash' in full_text:
                enhanced_name += ' Dishwash Bar'
                
            name = enhanced_name
        
        # Enhance description if it's too generic
        if description in ['', f"{name}. Quality product from {brand}."]:
            if category == 'Household' and ('dishwash' in full_text or 'dish wash' in full_text):
                description = f"{brand} {name} is an effective dishwashing bar that helps remove grease and food residue from dishes."
                
                if 'anti-bacterial' in full_text or 'antibacterial' in full_text:
                    description += " With anti-bacterial properties to ensure hygienic cleaning."
                
                if 'ginger' in full_text:
                    description += " Features a refreshing ginger fragrance."
                    
        # Format the final result
        result = {
            'Barcode': barcode,
            'Product Name': name ,
            'Brand': brand ,
            'Description': description ,
            'Category': category,
            'Subcategory': subcategory,
            'ProductLine': f"{brand} {subcategory} Products" if subcategory else f"{brand} Products",
            'Quantity': quantity,
            'Unit': unit ,
            'Features': features,
            'Specification': specifications,
            'Product Image': product_data.get('image_url', ''),
            'Product Ingredient Image': product_data.get('ingredient_image', ''),
            'Nutrition Image': product_data.get('nutrition_image', ''),
            'Data Source': f"Intelligent Processing - {product_data.get('source', 'Multiple Sources')}",
            'Timestamp': datetime.now().isoformat()
        }
        
        return result

    def cleanup(self):
        """Clean up temporary files and directories."""
        if self.temp_dir and os.path.exists(self.temp_dir):
            try:
                import shutil
                shutil.rmtree(self.temp_dir)
                logger.info(f"Cleaned up temporary directory: {self.temp_dir}")
            except Exception as e:
                logger.warning(f"Could not clean up temporary directory: {e}")

    def get_processing_stats(self):
        """Get processing statistics."""
        return {
            "processed_items": len(self.processed_barcodes),
            "ai_service_status": self.ai_service_status,
            "last_processed_barcode": self.processed_barcodes[-1] if self.processed_barcodes else None
        }


def main():
    """Main function for command line usage."""
    processor = BarcodeAPIProcessor()
    
    try:
        # Check if input is from stdin (pipe)
        if not sys.stdin.isatty():
            # Reading from pipe (echo '["barcode"]' | python script.py)
            try:
                input_data = sys.stdin.read().strip()
                if input_data:
                    barcodes = json.loads(input_data)
                    if not isinstance(barcodes, list):
                        barcodes = [str(barcodes)]
                else:
                    print("Error: No input data received from stdin", file=sys.stderr)
                    sys.exit(1)
            except json.JSONDecodeError as e:
                print(f"Error: Invalid JSON input from stdin: {e}", file=sys.stderr)
                sys.exit(1)
        else:
            # Reading from command line arguments
            if len(sys.argv) < 2:
                print("Usage: python barcode_api_processor.py <barcode1> [barcode2] [barcode3] ...")
                print("   or: echo '[\"barcode1\", \"barcode2\"]' | python barcode_api_processor.py")
                sys.exit(1)
            barcodes = sys.argv[1:]
        
        # Process barcodes
        results = processor.process_barcodes(barcodes)
        
        # Output results as JSON
        print(json.dumps(results, indent=2))
        
    except KeyboardInterrupt:
        print("Processing interrupted by user", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error in main: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()