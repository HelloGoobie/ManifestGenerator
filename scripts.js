document.addEventListener('DOMContentLoaded', () => {
    const scriptTabButton = document.getElementById('scriptTab');
    const vehicleTabButton = document.getElementById('vehicleTab');
    const scriptTabContent = document.getElementById('scriptTabContent');
    const vehicleTabContent = document.getElementById('vehicleTabContent');
    const scriptForm = document.getElementById('scriptForm');
    const vehicleForm = document.getElementById('vehicleForm');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const scriptErrorContainer = document.getElementById('scriptErrorContainer');
    const vehicleErrorContainer = document.getElementById('vehicleErrorContainer');

    scriptTabButton.addEventListener('click', () => {
        showTab('script');
    });

    vehicleTabButton.addEventListener('click', () => {
        showTab('vehicle');
    });

    scriptForm.addEventListener('submit', function(event) {
        event.preventDefault();
        scriptErrorContainer.innerHTML = ''; // Clear previous errors
        generateScriptManifest();
    });

    vehicleForm.addEventListener('submit', function(event) {
        event.preventDefault();
        vehicleErrorContainer.innerHTML = ''; // Clear previous errors
        generateVehicleManifest();
    });

    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    function showTab(tabName) {
        if (tabName === 'script') {
            scriptTabContent.classList.add('active');
            vehicleTabContent.classList.remove('active');
            scriptTabButton.classList.add('active');
            vehicleTabButton.classList.remove('active');
        } else if (tabName === 'vehicle') {
            scriptTabContent.classList.remove('active');
            vehicleTabContent.classList.add('active');
            scriptTabButton.classList.remove('active');
            vehicleTabButton.classList.add('active');
        }
    }

    function generateScriptManifest() {
        try {
            const name = document.getElementById('scriptName').value.trim();
            const description = document.getElementById('scriptDescription').value.trim();
            const version = document.getElementById('scriptVersion').value.trim();
            const author = document.getElementById('scriptAuthor').value.trim();
            const folder = document.getElementById('scriptFolder').value.trim();
            const clientScripts = document.getElementById('clientScripts').value.trim().split(',').map(script => script.trim()).filter(script => script.length > 0);
            const serverScripts = document.getElementById('serverScripts').value.trim().split(',').map(script => script.trim()).filter(script => script.length > 0);
            const dependencies = document.getElementById('dependencies').value.trim().split(',').map(dep => dep.trim()).filter(dep => dep.length > 0);
            const isMap = document.getElementById('isMap').checked;

            if (!name) {
                showError(scriptErrorContainer, 'Resource Name is required.');
                return;
            }

            let manifest = '';

            if (isMap) {
                manifest += `fx_version 'cerulean'
games { 'gta5' }
this_is_a_map 'yes'

files {
    '${folder ? folder + '/**' : '**/*'}',
}

`;
            } else {
                manifest += `fx_version 'cerulean'
games { 'gta5' }

author '${author}'
description '${description}'
version '${version}'

`;

                if (clientScripts.length > 0) {
                    manifest += `client_scripts {
    ${clientScripts.map(script => `'${folder ? folder + '/' : ''}${script}'`).join(',\n    ')}
}
`;
                }

                if (serverScripts.length > 0) {
                    manifest += `server_scripts {
    ${serverScripts.map(script => `'${folder ? folder + '/' : ''}${script}'`).join(',\n    ')}
}
`;
                }

                if (dependencies.length > 0) {
                    manifest += `dependencies {
    ${dependencies.map(dep => `'${dep}'`).join(',\n    ')}
}
`;
                }

                manifest += `files {
    '${folder ? folder + '/**' : '**/*'}',
}
`;
            }

            document.getElementById('manifestOutput').value = manifest;
            updateDownloadButton(manifest);
        } catch (error) {
            showError(scriptErrorContainer, 'An error occurred while generating the script manifest. Please check your input and try again.');
            console.error('Error generating script manifest:', error);
        }
    }

    function generateVehicleManifest() {
        try {
            const name = document.getElementById('vehicleName').value.trim();
            const description = document.getElementById('vehicleDescription').value.trim();
            const version = document.getElementById('vehicleVersion').value.trim();
            const author = document.getElementById('vehicleAuthor').value.trim();
            const folder = document.getElementById('vehicleFolder').value.trim();

            if (!name) {
                showError(vehicleErrorContainer, 'Resource Name is required.');
                return;
            }

            let manifest = `name '${name}'
description '${description}'
author '${author}'
version '${version}'

vehicle_credits 'sds' {author = '${author}'}

fx_version 'adamant'
game 'gta5'

files {
    '${folder ? folder + '/**' : 'levels/**'}',
}

`;

            if (document.getElementById('metaHandling').checked) {
                manifest += `data_file 'HANDLING_FILE' '${folder ? folder + '/' : 'levels/'}handling.meta'
`;
            }

            if (document.getElementById('metaVehicle').checked) {
                manifest += `data_file 'VEHICLE_METADATA_FILE' '${folder ? folder + '/' : 'levels/'}vehicles.meta'
`;
            }

            if (document.getElementById('metaVariations').checked) {
                manifest += `data_file 'VEHICLE_VARIATION_FILE' '${folder ? folder + '/' : 'levels/'}carvariations.meta'
`;
            }

            if (document.getElementById('metaCols').checked) {
                manifest += `data_file 'CARCOLS_FILE' '${folder ? folder + '/' : 'levels/'}carcols.meta'
`;
            }

            manifest += `client_script 'vehiclenames.lua'
`;

            document.getElementById('manifestOutput').value = manifest;
            updateDownloadButton(manifest);
        } catch (error) {
            showError(vehicleErrorContainer, 'An error occurred while generating the vehicle manifest. Please check your input and try again.');
            console.error('Error generating vehicle manifest:', error);
        }
    }

    function showError(container, message) {
        container.innerHTML = `<p>${message}</p>`;
    }

    function updateDownloadButton(manifest) {
        const downloadSection = document.getElementById('downloadSection');
        downloadSection.innerHTML = `<button id="downloadLink" class="download-button">Download fxmanifest.lua</button>`;

        document.getElementById('downloadLink').addEventListener('click', () => {
            const blob = new Blob([manifest], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fxmanifest.lua';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    function initializeDarkMode() {
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        }
    }

    initializeDarkMode();
    showTab('script'); // Show script tab by default
});
