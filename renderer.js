document.getElementById('fileInput').addEventListener('change', async function (event) {
    const files = event.target.files;
    const audioPlayer = document.getElementById('audioPlayer');
    const metadataDiv = document.getElementById('metadata');
    const copyButton = document.getElementById('copyButton');
  
    if (files.length > 0) {
      const fileURL = URL.createObjectURL(files[0]);
      audioPlayer.src = fileURL;
      audioPlayer.play();
  
      const arrayBuffer = await files[0].arrayBuffer();
      const metadata = await window.electron.parseMetadata(arrayBuffer);
      console.log(metadata);
  
      // Display metadata
      metadataDiv.innerHTML = `<pre id="metadataText">${JSON.stringify(metadata, null, 2)}</pre>`;
  
      // Enable the copy button and add event listener
      copyButton.disabled = false;
      copyButton.addEventListener('click', () => {
        const metadataText = document.getElementById('metadataText').innerText;
        navigator.clipboard.writeText(metadataText).then(() => {
          alert('Metadata copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy metadata: ', err);
        });
      });
    }
  });
  