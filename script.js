document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('manifestForm').addEventListener('submit', function(event) {
        event.preventDefault();
        generateManifest();
    });
});

function generateManifest() {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const version = document.getElementById('version').value.trim();
    const author = document.getElementById('author').value.trim();
    const clientScripts = document.getElementById('clientScripts').value.trim().split(',').map(script => script.trim()).filter(script => script.length > 0);
    const serverScripts = document.getElementById('serverScripts').value.trim().split(',').map(script => script.trim()).filter(script => script.length > 0);
    const dependencies = document.getElementById('dependencies').value.trim().split(',').map(dep => dep.trim()).filter(dep => dep.length > 0);

    if (!name || !description || !version || !author) {
        alert('Please fill in all required fields.');
        return;
    }

    const manifest = `fx_version 'cerulean'
game 'gta5'

author '${author}'
description '${description}'
version '${version}'

${clientScripts.length > 0 ? `client_scripts {\n    ${clientScripts.map(script => `'${script}'`).join(',\n    ')}\n}` : ''}
${serverScripts.length > 0 ? `\nserver_scripts {\n    ${serverScripts.map(script => `'${script}'`).join(',\n    ')}\n}` : ''}
${dependencies.length > 0 ? `\ndependency '${dependencies.join(', ')}'` : ''}`;

    const manifestOutput = document.getElementById('manifestOutput');
    manifestOutput.value = manifest;
    manifestOutput.style.height = 'auto'; // Adjust height to fit content
    manifestOutput.style.height = `${manifestOutput.scrollHeight}px`; // Set height based on content
}
