const grid = document.getElementById('filesGrid');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxLabel = document.getElementById('lightbox-label');
const lightboxClose = document.getElementById('lightboxClose');
const deleteModal = document.getElementById('deleteModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');

let pendingDelete = null;

// Upload via click
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => processFiles(e.target.files));

// Drag and drop
uploadArea.addEventListener('dragover', e => { 
    e.preventDefault(); 
    uploadArea.classList.add('dragover'); 
});

uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));

uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    processFiles(e.dataTransfer.files);
});

function processFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();

        reader.onload = e => addCard(e.target.result, file.name);

        reader.readAsDataURL(file);
    });

    fileInput.value = '';
}

function addCard(src, name) {
    const card = document.createElement('div');
    card.className = 'file-card';

    const img = document.createElement('img');
    img.src = src;
    img.alt = name;
    img.title = 'Click to view';

    const label = document.createElement('input');
    label.type = 'text';
    label.className = 'card-label-input';
    label.value = name.replace(/\.[^/.]+$/, ''); // strip extension
    label.placeholder = 'Add a label...';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'card-remove';
    removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    removeBtn.title = 'Remove';

    img.addEventListener('click', () => {
        lightboxImg.src = src;
        lightboxLabel.textContent = label.value || name;
        lightbox.classList.remove('hidden');
    });

    removeBtn.addEventListener('click', e => {
        e.stopPropagation();
        pendingDelete = card;
        deleteModal.classList.remove('hidden');
    });

    card.appendChild(img);
    card.appendChild(label);
    card.appendChild(removeBtn);
    grid.appendChild(card);
}

// Lightbox close
lightboxClose.addEventListener('click', () => lightbox.classList.add('hidden'));

lightbox.addEventListener('click', e => { 
    if (e.target === lightbox) lightbox.classList.add('hidden'); 
});

// Delete modal
cancelDelete.addEventListener('click', () => { 
    deleteModal.classList.add('hidden'); 
    pendingDelete = null; 
});

confirmDeleteBtn.addEventListener('click', () => {
    if (pendingDelete) { 
        pendingDelete.remove(); 
        pendingDelete = null; 
    }

    deleteModal.classList.add('hidden');
});

// Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        lightbox.classList.add('hidden');
        deleteModal.classList.add('hidden');
    }
});