const photoInput = document.getElementById('photoInput');
const uploadArea = document.getElementById('uploadArea');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const previewImage = document.getElementById('previewImage');
const outfitForm = document.getElementById('outfitForm');
const submitBtn = document.getElementById('submitBtn');
const resultSection = document.getElementById('resultSection');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');

let selectedFile = null;

photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (evt) => {
        previewImage.src = evt.target.result;
        previewImage.classList.remove('hidden');
        uploadPlaceholder.classList.add('hidden');
    };
    reader.readAsDataURL(file);
});

// Allow drag & drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#f5576c';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (evt) => {
            previewImage.src = evt.target.result;
            previewImage.classList.remove('hidden');
            uploadPlaceholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

outfitForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedFile) {
        alert('Please upload a photo first.');
        return;
    }

    const apiKey = document.getElementById('apiKey').value.trim();
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const city = document.getElementById('city').value.trim();
    const travelDate = document.getElementById('travelDate').value;

    if (!apiKey) {
        alert('Please enter your OpenAI API Key.');
        return;
    }

    setLoading(true);

    try {
        const prompt = `Provide outfit recommendation for the given info.
Change the person's clothes in the photo to match the recommended outfit.
Keep the person's face, body, and pose exactly the same — only change the clothing.
- photo: attached photo
- weight: ${weight}kg
- height: ${height}cm
- city: ${city}
- date: ${travelDate}
Consider the weather, culture, and typical activities for ${city} around ${travelDate}.`;

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('prompt', prompt);
        formData.append('model', 'gpt-image-1');
        formData.append('n', '1');
        formData.append('size', '1024x1024');
        formData.append('quality', 'auto');

        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        const b64 = data.data[0].b64_json;

        originalImage.src = previewImage.src;
        resultImage.src = `data:image/png;base64,${b64}`;
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        alert(`Error: ${err.message}`);
    } finally {
        setLoading(false);
    }
});

function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.querySelector('.btn-text').classList.toggle('hidden', loading);
    submitBtn.querySelector('.btn-loading').classList.toggle('hidden', !loading);
}
