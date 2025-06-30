import React from 'react';

const mockDrafts = [
 {
   _id: "686256b337f8696ed899f530",
   productId: "P00026",
   employeeId: "68514f35a32b42f2d1511788",
   draftData: {
     Barcode: "8902102127819",
     Brand: "Henko",
     Category: "Laundry Detergents",
     ProductLine: "Detergent Powder",
     ProductName: "Henko Stain Care Detergent Powder, 4 kg Pouch",
     Description:
       "Henko Stain Care Detergent Powder is specially formulated to tackle stubborn stains while being gentle on your clothes. It not only cleans but also cares for fabric color and texture, offering a perfect balance of performance and care. Ideal for both machine and hand washing.",
     Quantity: 4000,
     Unit: "gm",
     Features: [
       "Removes tough stains like ink, oil, and curry",
       "Preserves fabric color and softness",
       "Long-lasting floral fragrance",
       "Dissolves easily in water without leaving residue",
       "Works with both hand and machine wash",
     ],
     Specification: {
       Form: "Powder",
       Color: "Light purple/blue powder",
       Fragrance: "Fresh floral",
       Compatibility: "Top and front load washing machines",
       PackagingType: "Pouch",
       NetWeight: "4 kg",
     },
   },
   lastSaved: "2025-06-30T09:19:47.131Z",
 },
 {
   _id: "6862569437f8696ed899f4f4",
   productId: "P00001",
   employeeId: "68514f35a32b42f2d1511788",
   draftData: {
     Barcode: "8902102163961",
     Brand: "Exo",
     Category: "Dishwash Detergents",
     ProductLine: "Dishwash Bar",
     ProductName: "Exo Anti-Bacterial Dishwash Bar – Ginger Twist",
     Description:
       "Anti-bacterial dishwash bar infused with ginger extract, designed to eliminate grease and germs while protecting hands from harsh chemicals.",
     Quantity: 360,
     Unit: "gm",
     Features: [
       "Kills 99.9% germs",
       "Ginger extract for freshness",
       "Removes stubborn grease",
       "Skin-friendly formula",
     ],
     Specification: {
       PackType: "Multipack",
       PackSize: "4 x 90g",
       CountryOfOrigin: "India",
       Manufacturer: "Jyothy Laboratories Ltd.",
     },
   },
   lastSaved: "2025-06-30T09:19:16.196Z",
 },
];

const EmployeeDraft = () => {
 return (
   <div style={styles.container}>
     <div style={styles.header}>
       <h1 style={styles.title}>Draft Products</h1>
       {/* <p style={styles.subtitle}>Auto-saved product entries ready for review</p> */}
     </div>
     
     <div style={styles.cardsContainer}>
       {mockDrafts.map((draft) => (
         <div key={draft._id} style={styles.card}>
           <div style={styles.cardHeader}>
             <div style={styles.brandBadge}>{draft.draftData.Brand}</div>
             <div style={styles.categoryBadge}>{draft.draftData.Category}</div>
           </div>
           
           <div style={styles.cardBody}>
             <h3 style={styles.productName}>{draft.draftData.ProductName}</h3>
             {/* <p style={styles.description}>{draft.draftData.Description}</p> */}
             
             <div style={styles.detailsGrid}>
               <div style={styles.detailItem}>
                 <span style={styles.detailLabel}>Barcode:</span>
                 <span style={styles.detailValue}>{draft.draftData.Barcode}</span>
               </div>
               {/* <div style={styles.detailItem}>
                 <span style={styles.detailLabel}>Product ID:</span>
                 <span style={styles.detailValue}>{draft.productId}</span>
               </div> */}
               <div style={styles.detailItem}>
                 <span style={styles.detailLabel}>Quantity:</span>
                 <span style={styles.detailValue}>{draft.draftData.Quantity} {draft.draftData.Unit}</span>
               </div>
             </div>

             {/* <div style={styles.featuresSection}>
               <h4 style={styles.featuresTitle}>Key Features:</h4>
               <div style={styles.featuresList}>
                 {draft.draftData.Features.slice(0, 3).map((feature, index) => (
                   <span key={index} style={styles.featureTag}>
                     {feature}
                   </span>
                 ))}
                 {draft.draftData.Features.length > 3 && (
                   <span style={styles.moreFeatures}>
                     +{draft.draftData.Features.length - 3} more
                   </span>
                 )}
               </div>
             </div> */}
           </div>
           
           <div style={styles.cardFooter}>
             <div style={styles.timestamp}>
               <span style={styles.timestampLabel}>Last saved:</span>
               <span style={styles.timestampValue}>
                 {new Date(draft.lastSaved).toLocaleString()}
               </span>
             </div>
             <div style={styles.actions}>
               <button style={styles.editButton}>Edit Draft</button>
               {/* <button style={styles.publishButton}>Publish</button> */}
             </div>
           </div>
         </div>
       ))}
     </div>
   </div>
 );
};

const styles = {
 container: {
   padding: '2rem',
   fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
   backgroundColor: '#f8fafc',
   minHeight: '100vh',
   lineHeight: '1.6',
 },
 header: {
   marginBottom: '2rem',
   textAlign: 'center',
 },
 title: {
   fontSize: '2.5rem',
   color: '#1e293b',
   marginBottom: '0.5rem',
   fontWeight: '700',
 },
 subtitle: {
   fontSize: '1.1rem',
   color: '#64748b',
   margin: '0',
 },
 cardsContainer: {
   display: 'grid',
   gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
   gap: '1.5rem',
   maxWidth: '1200px',
   margin: '0 auto',
 },
 card: {
   backgroundColor: 'white',
   borderRadius: '16px',
   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
   overflow: 'hidden',
   transition: 'transform 0.2s ease, box-shadow 0.2s ease',
   border: '1px solid #e2e8f0',
 },
 cardHeader: {
   padding: '1.5rem 1.5rem 0',
   display: 'flex',
   gap: '0.75rem',
   alignItems: 'center',
 },
 brandBadge: {
   backgroundColor: '#10b981',
   color: 'white',
   padding: '0.375rem 0.75rem',
   borderRadius: '20px',
   fontSize: '0.875rem',
   fontWeight: '600',
 },
 categoryBadge: {
   backgroundColor: '#f3f4f6',
   color: '#374151',
   padding: '0.375rem 0.75rem',
   borderRadius: '20px',
   fontSize: '0.875rem',
   fontWeight: '500',
 },
 cardBody: {
   padding: '1.5rem',
 },
 productName: {
   fontSize: '1.25rem',
   fontWeight: '700',
   color: '#1e293b',
   marginBottom: '0.75rem',
   lineHeight: '1.4',
 },
 description: {
   color: '#64748b',
   fontSize: '0.95rem',
   marginBottom: '1.5rem',
   lineHeight: '1.6',
 },
 detailsGrid: {
   display: 'grid',
   gridTemplateColumns: '1fr',
   gap: '0.75rem',
   marginBottom: '1.5rem',
   padding: '1rem',
   backgroundColor: '#f8fafc',
   borderRadius: '8px',
 },
 detailItem: {
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
 },
 detailLabel: {
   fontSize: '0.875rem',
   fontWeight: '600',
   color: '#374151',
 },
 detailValue: {
   fontSize: '0.875rem',
   color: '#6b7280',
   fontFamily: 'monospace',
 },
 featuresSection: {
   marginBottom: '1rem',
 },
 featuresTitle: {
   fontSize: '1rem',
   fontWeight: '600',
   color: '#374151',
   marginBottom: '0.75rem',
 },
 featuresList: {
   display: 'flex',
   flexWrap: 'wrap',
   gap: '0.5rem',
 },
 featureTag: {
   backgroundColor: '#eff6ff',
   color: '#1d4ed8',
   padding: '0.25rem 0.5rem',
   borderRadius: '6px',
   fontSize: '0.75rem',
   fontWeight: '500',
   border: '1px solid #dbeafe',
 },
 moreFeatures: {
   color: '#6b7280',
   fontSize: '0.75rem',
   fontStyle: 'italic',
   padding: '0.25rem 0.5rem',
 },
 cardFooter: {
   padding: '1rem 1.5rem',
   backgroundColor: '#f8fafc',
   borderTop: '1px solid #e2e8f0',
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
   flexWrap: 'wrap',
   gap: '1rem',
 },
 timestamp: {
   display: 'flex',
   flexDirection: 'column',
   gap: '0.25rem',
 },
 timestampLabel: {
   fontSize: '0.75rem',
   color: '#6b7280',
   textTransform: 'uppercase',
   letterSpacing: '0.05em',
 },
 timestampValue: {
   fontSize: '0.875rem',
   color: '#374151',
   fontWeight: '500',
 },
 actions: {
   display: 'flex',
   gap: '0.75rem',
 },
 editButton: {
   padding: '0.5rem 1rem',
   backgroundColor: '#f3f4f6',
   color: '#374151',
   border: '1px solid #d1d5db',
   borderRadius: '6px',
   fontSize: '0.875rem',
   fontWeight: '500',
   cursor: 'pointer',
   transition: 'all 0.2s ease',
 },
 publishButton: {
   padding: '0.5rem 1rem',
   backgroundColor: '#3b82f6',
   color: 'white',
   border: 'none',
   borderRadius: '6px',
   fontSize: '0.875rem',
   fontWeight: '600',
   cursor: 'pointer',
   transition: 'all 0.2s ease',
 },
};

export default EmployeeDraft;