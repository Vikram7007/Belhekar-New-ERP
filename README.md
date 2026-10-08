# 🏛️ BELHEKAR GROUP OF INSTITUTIONS - UNIFIED ACADEMIC & INSTITUTIONAL ERP SUITE
> **Belhekar EduERP Pro v4.5** — Designed strictly as per the comprehensive Institutional ERP Software Requirements Specification (SRS) PDF.

---

## 🌟 Overview & Key Highlights

This ERP system is a modern, high-grade, full-stack enterprise web application built for the **12 Colleges & Schools** of the Belhekar Group:
1. **Sant Dnyaneshwar MBA & MCA College**
2. **P.V. Belhekar Ayurveda Medical College (BAMS)**
3. **College of Agriculture (Bsc Agri)**
4. **P.V. Belhekar College of Pharmacy (D.Pharm and B.Pharm)**
5. **Dnyaneshwar Polytechnic College (Polytechnic)**
6. **P.V. Belhekar College of Nursing (GNM)**
7. **BCA College (BCA)**
8. **Late P.V. Belhekar College (BA)**
9. **Dnyaneshwar Private Industrial Training Institute (ITI)**
10. **Sant Dnyaneshwar B.Ed. College (Bed)**
11. **Dnyaneshwar International School (DIS)**
12. **Dnyaneshwar Public School and Junior College (DPS)**

---

## 👥 7 Role-Based Concurrent Portals (Access Control Lists)

| # | Role / Login | Access Control & Functional Modules |
|---|--------------|--------------------------------------|
| 1 | **Admin** | Full system configuration, user provisioning, all 8 modules, master data, audit logs |
| 2 | **Principal** | Executive approvals, Student, HR, Teacher, Asset/Store, Exam, NAAC/NBA, Library |
| 3 | **Clerk** | Student admissions, Document Generation (Bonafide, LC, 15A, Validity), Placements, Alumni |
| 4 | **Faculty** | Student directory, Attendance marking (P/A & Duration), Internal Marks (K3/K5/K6), Profile & Salary |
| 5 | **Accountant** | Student fee collection desk, Double-Entry ledger (Income vs Outflow), Scholarships, Staff payroll |
| 6 | **Store Officer** | Inward vendor materials, outward stock distribution to staff & sister schools, remaining stock calculation |
| 7 | **Librarian** | Book & Journal accession, circulation desk (Issue/Return), automated daily late fine calculations |

> **Quick Switcher**: Click the **"Switch Portal"** button in the top navigation bar to instantaneously test and inspect any of the 7 portals!

---

## 📦 Core Functional Modules Implemented

### 1. 🎓 Student Management & Master Digital Profiles
- **Academic Identity**: Application ID, Enrollment Number, ABC ID (Academic Bank of Credits), Department, Year of Admission, Current Academic Year.
- **Demographics**: Full Name, Date of Birth, Gender, Category (General, OBC, SC, ST, NT, EWS), CAP Process Type (CAP Level-I, CAP Level-II, Against CAP, Institute Level), Birth Place.
- **Family & Contact**: Father's Name, Mother's Name, Student Mobile, Parent Mobile, Permanent Address, Email ID.
- **Statutory Data**: Aadhaar Number, Photo URL.
- **Financial Tagging**: Registration Fee, Tuition Fee, Development Fee, Exam Fee, MahaDBT Scholarship Eligibility Flag, Installment Tracker (Instalment I & II: Pending, Received, Adjusted).
- **Alumni Auto-Migration**: One-click action to graduate active students directly into the central Alumni Register with CTC package and hiring company info.

### 2. 👩‍🏫 Human Resource & Faculty Management
- **Faculty Master Profile**: Name, DOB, Gender, Category, Parents, Year of Joining, Department, Designation, Qualification, Official Email, Mobile, Emergency Contact, Address.
- **Statutory & Banking**: PAN Details, Aadhaar Details, ABC ID, Bank Account Number, Bank IFSC Code, Bank Branch, Base Salary Scale.
- **Monthly Attendance-Linked Payroll Sheet**: Auto-compiles biometric IN/OUT logs into gross salary, per-day rate, leave deductions, 5% Provident Fund (PF), and net monthly payout.

### 3. 🕒 Attendance & Biometric Integration (ESSL & Hikvision)
- **Dual Mode Student Attendance**:
  - *Mode A*: Manual Present/Absent (P/A) Quick Toggle.
  - *Mode B*: Automated Log: IN/OUT Timestamp capture with auto-calculated duration in minutes.
- **Faculty Biometric Logs**: Biometric verification with calculated shift duration (~8 hours).
- **Hardware Device Integration (Page 8 in PDF)**:
  - Supports **ESSL** & **Hikvision** terminals with IP address, port protocol, location monitoring.
  - Interactive **"Sync Hardware Terminals"** button to pull and buffer live biometric logs.

### 4. 📜 Document & Statutory Certificate Generation Engine
Pre-designed institutional letterheads with seal, watermark, serial number, and direct print styling (`@media print` clean sheet):
1. **Bonafide Certificate**: Proof of enrollment, character, and conduct for passport, bus pass, or scholarship.
2. **Leaving Certificate (LC) / Transfer Certificate (TC)**: Official transfer records with conduct, progress, leaving reason, and dues clearance.
3. **Form 15A**: Verified statement of academic fee dues for bank education loans and employer reimbursement.
4. **Caste Validity Support Letter**: Official verification letter addressed to Divisional Caste Scrutiny Committee citing General Register records.

### 5. 📊 Academics & Internal Assessment (K3, K5, K6 Frameworks)
- Tabular score entry screens filtered by Department, Year, and Subject.
- **Bloom's Taxonomy Levels**:
  - **K3 Level**: Domain Application & Execution.
  - **K5 Level**: Critical Evaluation & System Analysis.
  - **K6 Level**: Synthesis, Design & Creative Solutions.
- **Strict Validation**: Prevents faculty from entering scores that exceed the configured maximum limits.

### 6. 💼 Corporate Placements & Alumni Repository
- **Placement Tracker**: Candidate Name, Enrollment No, Department, Academic Year, Hiring Recruiter, Offered CTC Package (LPA), Designation.
- **Alumni Register**: Central database archiving past graduates with current employers, designation, and higher studies records.

### 7. 💰 Finance & Double-Entry Accounting Engine (Page 4 Specification)
- Visual flowchart matching the double-entry accounting engine architecture:
  - **TOTAL INCOME (A)**: Tuition & Dev Fees, Exam & Other Fees, Certificate Fees (Bonafide/LC/15A), Govt Scholarships Adjusted.
  - **TOTAL EXPENDITURE (B)**: Staff Payroll Payments, Petty Cash Vouchers, Bank Cheque Disbursements, Vendor Bill Settlements.
  - **Net Operating Surplus**: Real-time balance calculation.
- **Student Fee Collection Counter**: Sub-head breakdown (Tuition, Dev, Exam, Registration, Bonafide, 15A, LC, Hostel, Transport, Other) with printable PDF receipts.
- **Expense Voucher Management**: Digital voucher creation, cash/cheque/NEFT modes, and approval routing.
- **Scholarship Ledger**: MahaDBT incoming funds tracking against individual student accounts.

### 8. 📦 Central Store & Asset Inventory
- **Inward Stock**: Name of Supplier, Date of receipt, Material description, Category, Received Qty, Rate, Total Cost, Warehouse Location.
- **Outward Distribution**: Name of Person, Target College/School, Department, Distributed Qty, Automatic deduction of remaining inventory stock.

### 9. 📚 Library Management System (LMS)
- **Book Accession**: Accession Number, Title, Author, Publisher, Edition, Category, Rack/Shelf Location, Total Copies, Available Copies, Price.
- **Journal Accession**: Accession Number, Title, ISSN, Frequency, Volume/Issue, Subscription Year, Stand Location.
- **Circulation Desk**: Issue to Student/Faculty, Due Date tracking, Return processing with automated daily late fine calculations (₹2/day).

### 10. 🏛️ Accreditation & Compliance Framework (NAAC & NBA)
- **NAAC SSR Criteria**:
  - *Metric 2.2.2*: Student - Full Time Teacher Ratio computation.
  - *Metric 5.2.1*: Placement & Progression metrics with average CTC package.
  - *Metric 6.2.3*: Institutional e-governance implementation status across ERP modules.
- **NBA Outcome-Based Education (OBE)**:
  - Mapping K3/K5/K6 internal marks to Program Outcomes (PO1 to PO4).
  - Course Outcomes (CO101.1 to CO101.3) target attainment matrices.

### 11. 🛡️ Security & Immutable Audit Trail
- Non-functional requirement compliance: logs user, role, module, action (LOGIN, CREATE, FEE_RECEIPT, etc.), timestamp, IP address, and changed values.

---

## 🚀 Running the Project Locally

### 1. Backend Server
```bash
cd backend
node server.js
```
*Backend runs on: `http://localhost:5000`*

### 2. Frontend Application
```bash
cd frontend
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Lucide Icons, Custom High-End College ERP Design System (Plus Jakarta Sans, Cinzel typography, glassmorphism, responsive data tables, `@media print` certificate engine).
- **Backend**: Node.js, Express REST API, SQLite (`better-sqlite3`) with WAL mode and foreign key constraints.
- **Database**: `erp.db` (auto-created and pre-seeded with all 12 institutions and sample data).
