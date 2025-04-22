import { saveAs } from 'file-saver';

let selectedFile = null;
let selectedConversion = null;

document.getElementById('fileInput').addEventListener('change', (e) => {
  selectedFile = e.target.files[0];
  document.getElementById('fileName').textContent = selectedFile ? selectedFile.name : 'No file selected';
});

document.querySelectorAll('.conversion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.conversion-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedConversion = btn.id;
  });
});

document.getElementById('startBtn').addEventListener('click', async () => {
  if (!selectedFile) {
    alert('No file selected');
    return;
  }
  
  if (!selectedConversion) {
    alert('Please select a conversion type');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('conversionType', selectedConversion);

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
    }

    const result = await response.json();
    saveAs(new Blob([result.data]), `converted.${result.extension}`);
  } catch (error) {
    console.error('Conversion error:', error);
    alert(`Conversion failed: ${error.message}`);
  }
});
