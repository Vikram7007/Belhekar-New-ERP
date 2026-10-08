// Initial seed data for Belhekar ERP
const institutions = [
  { id: 1, name: 'Sant Dnyaneshwar MBA & MCA College', code: 'SD-MBA-MCA', short: 'MBA & MCA', cat: 'Higher Education' },
  { id: 2, name: 'P.V. Belhekar Ayurveda Medical College (BAMS)', code: 'PVB-BAMS', short: 'Ayurveda Medical (BAMS)', cat: 'Medical' },
  { id: 3, name: 'College of Agriculture (Bsc Agri)', code: 'COA-AGRI', short: 'Agriculture (B.Sc)', cat: 'Agriculture' },
  { id: 4, name: 'P.V. Belhekar College of Pharmacy (D.Pharm and B.Pharm)', code: 'PVB-PHARM', short: 'Pharmacy (D/B.Pharm)', cat: 'Pharmacy' },
  { id: 5, name: 'Dnyaneshwar Polytechnic College (Polytechnic)', code: 'DPC-POLY', short: 'Polytechnic Diploma', cat: 'Technical' },
  { id: 6, name: 'P.V. Belhekar College of Nursing (GNM)', code: 'PVB-NURS', short: 'Nursing (GNM)', cat: 'Nursing' },
  { id: 7, name: 'BCA College (BCA)', code: 'BCA-COL', short: 'BCA College', cat: 'Computer Applications' },
  { id: 8, name: 'Late P.V. Belhekar College (BA)', code: 'LPVB-BA', short: 'Arts College (B.A.)', cat: 'Arts' },
  { id: 9, name: 'Dnyaneshwar Private Industrial Training Institute (ITI)', code: 'DP-ITI', short: 'ITI Vocational', cat: 'Vocational' },
  { id: 10, name: 'Sant Dnyaneshwar B.Ed. College (Bed)', code: 'SD-BED', short: 'Education (B.Ed)', cat: 'Education' },
  { id: 11, name: 'Dnyaneshwar International School (DIS)', code: 'DIS-SCH', short: 'International School', cat: 'School' },
  { id: 12, name: 'Dnyaneshwar Public School and Junior College (DPS)', code: 'DPS-JC', short: 'Public School & Jr College', cat: 'School & Jr College' },
];

const users = [
  { id: 1, institution_id: 1, u: 'admin', p: 'admin123', name: 'Dr. S. K. Belhekar (Chairman)', email: 'admin@belhekar.edu', role: 'Admin', desig: 'Campus Administrator' },
  { id: 2, institution_id: 1, u: 'principal', p: 'prin123', name: 'Dr. Rameshwar V. Patil', email: 'principal@belhekar.edu', role: 'Principal', desig: 'Director & Principal' },
  { id: 3, institution_id: 1, u: 'clerk', p: 'clerk123', name: 'Sunil D. Deshmukh', email: 'clerk@belhekar.edu', role: 'Clerk', desig: 'Senior Academic Registrar / Clerk' },
  { id: 4, institution_id: 1, u: 'faculty', p: 'fac123', name: 'Prof. Anjali M. Shinde', email: 'faculty@belhekar.edu', role: 'Faculty', desig: 'Assistant Professor & HOD' },
  { id: 5, institution_id: 1, u: 'account', p: 'acc123', name: 'Mahesh B. Kulkarni', email: 'accounts@belhekar.edu', role: 'Account', desig: 'Chief Finance & Accounts Officer' },
  { id: 6, institution_id: 1, u: 'store', p: 'store123', name: 'Ganesh T. Jadhav', email: 'store@belhekar.edu', role: 'Store', desig: 'Central Store & Asset Officer' },
  { id: 7, institution_id: 1, u: 'librarian', p: 'lib123', name: 'Pooja R. Bhalerao', email: 'librarian@belhekar.edu', role: 'Librarian', desig: 'Chief Librarian & Resource Manager' }
];

module.exports = {
  institutions,
  users
};
