document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('manifestForm').addEventListener('submit', function(event) {
        event.preventDefault();
        generateManifest();
    });

    document.getElementById('isVehicle').addEventListener('change', function() {
        const vehicleCreditsSection = document.getElementById('vehicleCreditsSection');
        vehicleCreditsSection.style.display = this.checked ? 'block' : 'none';
    });
});

function generateManifest() {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const version = document.getElementById('version').value.trim();
    const author = document.getElementById('author').value.trim();
    const folder = document.getElementById('folder').value.trim();
    const clientScripts = document.getElementById('clientScripts').value.trim().split(',').map(script => script.trim()).filter(script => script.length > 0);
    const serverScripts = document.getElementById('serverScripts').value.trim().split(',').map(script => script.trim()).filter(script => script.length > 0);
    const dependencies = document.getElementById('dependencies').value.trim().split(',').map(dep => dep.trim()).filter(dep => dep.length > 0);
    const isMap = document.getElementById('isMap').checked;
    const isVehicle = document.getElementById('isVehicle').checked;
    const vehicleCredits = document.getElementById('vehicleCredits').value.trim();

    if (!name || !description || !version || !author) {
        alert('Please fill in all required fields.');
        return;
    }

    let manifest = `fx_version 'cerulean'
game 'gta5'

author '${author}'
description '${description}'
version '${version}'

`;

    if (isMap) {
        manifest += `this_is_a_map 'yes'

`;
    }

    if (folder) {
        manifest += `files {
    '${folder}/**',
}

`;
    }

    if (clientScripts.length > 0) {
        manifest += `client_scripts {\n    ${clientScripts.map(script => `'${folder ? folder + '/' : ''}${script}'`).join(',\n    ')}\n}\n`;
    }

    if (serverScripts.length > 0) {
        manifest += `server_scripts {\n    ${serverScripts.map(script => `'${folder ? folder + '/' : ''}${script}'`).join(',\n    ')}\n}\n`;
    }

    if (dependencies.length > 0) {
        manifest += `dependency '${dependencies.join(', ')}'\n`;
    }

    if (isVehicle && vehicleCredits) {
        manifest += `vehicle_credits '${vehicleCredits}'

`;
    }

    const manifestOutput = document.getElementById('manifestOutput');
    manifestOutput.value = manifest;
    manifestOutput.style.height = 'auto';
    manifestOutput.style.height = `${manifestOutput.scrollHeight}px`;

    enableDownload(manifest);
}

function enableDownload(manifest) {
    const existingLink = document.getElementById('downloadLink');
    if (existingLink) {
        existingLink.remove();
    }

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(new Blob([manifest], { type: 'text/plain' }));
    downloadLink.download = 'fxmanifest.lua';
    downloadLink.textContent = 'Download fxmanifest.lua';
    downloadLink.id = 'downloadLink';

    const downloadSection = document.getElementById('downloadSection');
    downloadSection.appendChild(downloadLink);
}
