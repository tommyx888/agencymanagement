

let currentAgency = null;
let editingEmployeeId = null;
let currentLanguage = 'en';

const translations = {
    en: {
        'title': 'Agency Employee Management',
        'enter-password': 'Enter Password',
        'submit': 'Submit',
        'back-to-agency': 'Back to Agency Selection',
        'filter-agency': 'Filter by Agency:',
        'filter-position': 'Filter by Position:',
        'filter-category': 'Filter by Category:',
        'all': 'All',
        'operator-vyroby': 'Production Operator',
        'operator-vyroby-sicky': 'Production Operator - Sewing',
        'operator-logistiky': 'Logistics Operator',
        'agency': 'Agency',
        'name': 'Name',
        'nationality': 'Nationality',
        'date-of-birth': 'Date of Birth',
        'position': 'Position',
        'category': 'Category',
        'starting-date': 'Starting Date',
        'social-insurance': 'Social Insurance',
        'work-documents': 'Work Documents',
        'document-status': 'Document Status',
        'actions': 'Actions',
        'add-new-employee': 'Add New Employee',
        'select-agency': 'Select Agency',
        'select-nationality': 'Select Nationality',
        'select-position': 'Select Position',
        'select-category': 'Select Category',
        'add-employee': 'Add Employee',
        'cancel': 'Cancel',
        'edit': 'Edit',
        'delete': 'Delete',
        'view': 'View',
        'upload': 'Upload',
        'work-documents-note': 'Note: Upload either "confirmation of job position", "confirmation of refugee status", or for EU citizens: "first page of employment contract"',
        'login': 'Login',
        'signup': 'Sign Up',
        'logout': 'Logout'
    },
    sk: {
        'title': 'Správa zamestnancov agentúry',
        'enter-password': 'Zadajte heslo',
        'submit': 'Odoslať',
        'back-to-agency': 'Späť na výber agentúry',
        'filter-agency': 'Filtrovať podľa agentúry:',
        'filter-position': 'Filtrovať podľa pozície:',
        'filter-category': 'Filtrovať podľa kategórie:',
        'all': 'Všetko',
        'operator-vyroby': 'Operátor výroby',
        'operator-vyroby-sicky': 'Operátor výroby - šičky',
        'operator-logistiky': 'Operátor logistiky',
        'agency': 'Agentúra',
        'name': 'Meno',
        'nationality': 'Národnosť',
        'date-of-birth': 'Dátum narodenia',
        'position': 'Pozícia',
        'category': 'Kategória',
        'starting-date': 'Dátum nástupu',
        'social-insurance': 'Sociálne poistenie',
        'work-documents': 'Pracovné dokumenty',
        'document-status': 'Stav dokumentov',
        'actions': 'Akcie',
        'add-new-employee': 'Pridať nového zamestnanca',
        'select-agency': 'Vyberte agentúru',
        'select-nationality': 'Vyberte národnosť',
        'select-position': 'Vyberte pozíciu',
        'select-category': 'Vyberte kategóriu',
        'add-employee': 'Pridať zamestnanca',
        'cancel': 'Zrušiť',
        'edit': 'Upraviť',
        'delete': 'Vymazať',
        'view': 'Zobraziť',
        'upload': 'Nahrať',
        'work-documents-note': 'Poznámka: Nahrajte buď "potvrdenie o obsadení pracovného miesta", "potvrdenie o udelení štatútu odídenca", alebo pre občanov EÚ: "prvá strana pracovnej zmluvy"',
        'login': 'Prihlásiť sa',
        'signup': 'Registrovať sa',
        'logout': 'Odhlásiť sa'
    }
};

async function initializeApp() {
    document.getElementById('login-button').addEventListener('click', handleLogin);
    document.getElementById('signup-button').addEventListener('click', handleSignup);
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.getElementById('employee-form').addEventListener('submit', handleEmployeeSubmit);
    document.getElementById('filter-agency').addEventListener('change', loadEmployees);
    document.getElementById('filter-position').addEventListener('change', loadEmployees);
    document.getElementById('filter-category').addEventListener('change', loadEmployees);
    document.getElementById('cancel-edit').addEventListener('click', cancelEdit);
    document.getElementById('back-button').addEventListener('click', goBackToAgencySelection);

    document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
    document.getElementById('lang-sk').addEventListener('click', () => switchLanguage('sk'));

    applyLanguage();

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        showLoggedInState();
    }
}

async function handleLogin() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert('Error logging in: ' + error.message);
    } else {
        showLoggedInState();
    }
}

async function handleSignup() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        alert('Error signing up: ' + error.message);
    } else {
        alert('Signed up successfully! Please check your email for verification.');
    }
}

async function handleLogout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        alert('Error logging out: ' + error.message);
    } else {
        showLoggedOutState();
    }
}

function showLoggedInState() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('agency-list').style.display = 'block';
    document.getElementById('logout-button').style.display = 'block';
    loadAgencies();
}

function showLoggedOutState() {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('agency-list').style.display = 'none';
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('employee-database').style.display = 'none';
}

async function loadAgencies() {
    const { data: agencies, error } = await supabase
        .from('agencies')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching agencies:', error);
        return;
    }

    const agencyList = document.getElementById('agency-list');
    agencyList.innerHTML = '';

    agencies.forEach(agency => {
        const button = document.createElement('button');
        button.textContent = agency.name;
        button.addEventListener('click', () => selectAgency(agency));
        agencyList.appendChild(button);
    });
}

function selectAgency(agency) {
    currentAgency = agency;
    showEmployeeDatabase();
}

function showEmployeeDatabase() {
    document.getElementById('agency-list').style.display = 'none';
    document.getElementById('employee-database').style.display = 'block';
    document.getElementById('agency-name').textContent = currentAgency.name;
    if (currentAgency.name === 'IAC') {
        document.getElementById('filter-agency').style.display = 'inline-block';
        document.getElementById('employee-agency').style.display = 'inline-block';
    } else {
        document.getElementById('filter-agency').style.display = 'none';
        document.getElementById('employee-agency').value = currentAgency.name;
        document.getElementById('employee-agency').style.display = 'none';
    }
    loadEmployees();
}

async function loadEmployees() {
    const filterAgency = document.getElementById('filter-agency').value;
    const filterPosition = document.getElementById('filter-position').value;
    const filterCategory = document.getElementById('filter-category').value;

    let query = supabase
        .from('employees')
        .select('*')
        .order('starting_date', { ascending: true });

    if (currentAgency.name !== 'IAC') {
        query = query.eq('agency', currentAgency.name);
    } else if (filterAgency) {
        query = query.eq('agency', filterAgency);
    }

    if (filterPosition) {
        query = query.eq('position', filterPosition);
    }

    if (filterCategory) {
        query = query.eq('category', filterCategory);
    }

    const { data: employees, error } = await query;

    if (error) {
        console.error('Error fetching employees:', error);
        return;
    }

    const employeeList = document.getElementById('employee-list');
    employeeList.innerHTML = '';

    employees.forEach((employee) => {
        const row = employeeList.insertRow();
        row.insertCell(0).textContent = employee.agency;
        row.insertCell(1).textContent = employee.name;
        row.insertCell(2).textContent = employee.nationality;
        row.insertCell(3).textContent = employee.date_of_birth;
        row.insertCell(4).textContent = translations[currentLanguage][`operator-${employee.position.replace(' ', '-')}`] || employee.position;
        row.insertCell(5).textContent = employee.category;
        row.insertCell(6).textContent = employee.starting_date;
        
        const socialInsuranceCell = row.insertCell(7);
        const workDocumentsCell = row.insertCell(8);
        
        if (employee.social_insurance) {
            const viewButton = createViewButton(employee.social_insurance, translations[currentLanguage]['social-insurance']);
            socialInsuranceCell.appendChild(viewButton);
        } else {
            const uploadButton = createUploadButton('social_insurance', employee.id, employee.agency);
            socialInsuranceCell.appendChild(uploadButton);
        }
        
        if (employee.work_documents) {
            const viewButton = createViewButton(employee.work_documents, translations[currentLanguage]['work-documents']);
            workDocumentsCell.appendChild(viewButton);
        } else {
            const uploadButton = createUploadButton('work_documents', employee.id, employee.agency);
            workDocumentsCell.appendChild(uploadButton);
        }
        
        const statusCell = row.insertCell(9);
        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'document-status ' + (employee.social_insurance && employee.work_documents ? 'green' : 'red');
        statusCell.appendChild(statusIndicator);

        const actionsCell = row.insertCell(10);
        const editButton = document.createElement('button');
        editButton.textContent = translations[currentLanguage]['edit'];
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => editEmployee(employee.id));
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = translations[currentLanguage]['delete'];
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => deleteEmployee(employee.id));
        actionsCell.appendChild(deleteButton);
    });
}

function createViewButton(fileUrl, label) {
    const button = document.createElement('button');
    button.textContent = `${translations[currentLanguage]['view']} ${label}`;
    button.addEventListener('click', () => {
        window.open(fileUrl, '_blank');
    });
    return button;
}

function createUploadButton(documentType, employeeId, agencyName) {
    const button = document.createElement('button');
    button.textContent = `${translations[currentLanguage]['upload']} ${translations[currentLanguage][documentType === 'social_insurance' ? 'social-insurance' : 'work-documents']}`;
    button.className = 'file-upload-btn';
    button.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx';
        input.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                const { data, error } = await supabase.storage
                    .from('employee-documents')
                    .upload(`${agencyName}/${employeeId}/${documentType}/${file.name}`, file);

                if (error) {
                    console.error('Error uploading file:', error);
                    alert('Error uploading file. Please try again.');
                } else {
                    const { data: publicUrl } = supabase.storage
                        .from('employee-documents')
                        .getPublicUrl(`${agencyName}/${employeeId}/${documentType}/${file.name}`);

                    const { data: updateData, error: updateError } = await supabase
                        .from('employees')
                        .update({ [documentType]: publicUrl.publicUrl })
                        .eq('id', employeeId);

                    if (updateError) {
                        console.error('Error updating employee record:', updateError);
                        alert('Error updating employee record. Please try again.');
                    } else {
                        loadEmployees();
                    }
                }
            }
        });
        input.click();
    });

    if (documentType === 'work_documents') {
        const note = document.createElement('div');
        note.className = 'document-note';
        note.textContent = translations[currentLanguage]['work-documents-note'];
        const container = document.createElement('div');
        container.appendChild(button);
        container.appendChild(note);
        return container;
    }

    return button;
}

async function handleEmployeeSubmit(event) {
    event.preventDefault();
    
    const agency = currentAgency.name === 'IAC' ? document.getElementById('employee-agency').value : currentAgency.name;
    const name = document.getElementById('employee-name').value;
    const nationality = document.getElementById('employee-nationality').value;
    const dateOfBirth = document.getElementById('employee-dob').value;
    const position = document.getElementById('employee-position').value;
    const category = document.getElementById('employee-category').value;
    const startingDate = document.getElementById('employee-start-date').value;

    if (agency && name && nationality && dateOfBirth && position && category && startingDate) {
        const employeeData = {
            agency,
            name,
            nationality,
            date_of_birth: dateOfBirth,
            position,
            category,
            starting_date: startingDate
        };

        let result;
        if (editingEmployeeId) {
            result = await supabase
                .from('employees')
                .update(employeeData)
                .eq('id', editingEmployeeId);
        } else {
            result = await supabase
                .from('employees')
                .insert([employeeData]);
        }

        if (result.error) {
            console.error('Error adding/updating employee:', result.error);
            alert(currentLanguage === 'en' ? 'An error occurred while adding/updating the employee. Please try again.' : 'Pri pridávaní/aktualizácii zamestnanca sa vyskytla chyba. Skúste to znova.');
        } else {
            loadEmployees();
            resetForm();
        }
    } else {
        alert(currentLanguage === 'en' ? 'Please fill in all fields for the employee.' : 'Prosím, vyplňte všetky polia pre zamestnanca.');
    }
}

async function editEmployee(employeeId) {
    const { data: employee, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();
    
    if (error) {
        console.error('Error fetching employee:', error);
        return;
    }

    if (employee) {
        if (currentAgency.name === 'IAC') {
            document.getElementById('employee-agency').value = employee.agency;
        }
        document.getElementById('employee-name').value = employee.name;
        document.getElementById('employee-nationality').value = employee.nationality;
        document.getElementById('employee-dob').value = employee.date_of_birth;
        document.getElementById('employee-position').value = employee.position;
        document.getElementById('employee-category').value = employee.category;
        document.getElementById('employee-start-date').value = employee.starting_date;

        document.getElementById('form-title').textContent = translations[currentLanguage]['add-new-employee'];
        document.getElementById('submit-employee').textContent = translations[currentLanguage]['add-employee'];
        document.getElementById('cancel-edit').style.display = 'inline-block';

        editingEmployeeId = employeeId;
    }
}

async function deleteEmployee(employeeId) {
    if (confirm(currentLanguage === 'en' ? 'Are you sure you want to delete this employee?' : 'Ste si istý, že chcete vymazať tohto zamestnanca?')) {
        const { error } = await supabase
            .from('employees')
            .delete()
            .eq('id', employeeId);

        if (error) {
            console.error('Error deleting employee:', error);
            alert(currentLanguage === 'en' ? 'An error occurred while deleting the employee. Please try again.' : 'Pri mazaní zamestnanca sa vyskytla chyba. Skúste to znova.');
        } else {
            loadEmployees();
        }
    }
}

function cancelEdit() {
    resetForm();
}

function resetForm() {
    document.getElementById('employee-form').reset();
    document.getElementById('form-title').textContent = translations[currentLanguage]['add-new-employee'];
    document.getElementById('submit-employee').textContent = translations[currentLanguage]['add-employee'];
    document.getElementById('cancel-edit').style.display = 'none';
    editingEmployeeId = null;
    if (currentAgency.name !== 'IAC') {
        document.getElementById('employee-agency').value = currentAgency.name;
    }
}

function goBackToAgencySelection() {
    document.getElementById('agency-list').style.display = 'block';
    document.getElementById('employee-database').style.display = 'none';
    currentAgency = null;
    resetForm();
}

function switchLanguage(lang) {
    currentLanguage = lang;
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-sk').classList.toggle('active', lang === 'sk');
    applyLanguage();
}

function applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });

    if (currentAgency) {
        loadEmployees();
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);