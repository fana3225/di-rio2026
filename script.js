// Abrir seletor de arquivos
function triggerUpload(slot) {
    const input = slot.querySelector('input');
    input.click();
}

// Preview e Troca de Foto
function previewImage(event, input) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const slot = input.parentElement;
            const slotId = slot.getAttribute('data-id');
            
            let img = slot.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                slot.appendChild(img);
                if (slot.querySelector('.number')) slot.querySelector('.number').style.display = 'none';
            }
            img.src = e.target.result;
            localStorage.setItem('img_slot_' + slotId, e.target.result);
        }
        reader.readAsDataURL(file);
    }
}

// Download como Imagem (Tirando print do Álbum)
function baixarAlbum() {
    const album = document.querySelector('.album-container');
    html2canvas(album, {
        backgroundColor: "#f8f4f9",
        scale: 2 // Melhora a qualidade da imagem
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'meu-album-polaroid.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

// Reset Total do Álbum
function resetAlbum() {
    if (confirm("Deseja apagar todas as fotos e legendas?")) {
        // Limpa apenas as chaves do álbum e legendas
        for (let i = 1; i <= 8; i++) {
            localStorage.removeItem('img_slot_' + i);
            localStorage.removeItem('text_cap-' + i);
        }
        location.reload();
    }
}

// Carregar Dados ao Iniciar
window.onload = () => {
    // Carregar Fotos
    document.querySelectorAll('.slot').forEach(slot => {
        const slotId = slot.getAttribute('data-id');
        const savedImg = localStorage.getItem('img_slot_' + slotId);
        if (savedImg) {
            if (slot.querySelector('.number')) slot.querySelector('.number').style.display = 'none';
            const img = document.createElement('img');
            img.src = savedImg;
            slot.appendChild(img);
        }
    });

    // Carregar Legendas e Auto-save
    document.querySelectorAll('.caption').forEach(cap => {
        cap.value = localStorage.getItem('text_' + cap.id) || "";
        cap.addEventListener('input', () => {
            localStorage.setItem('text_' + cap.id, cap.value);
        });
    });

    // Iniciar outras funções de salvamento (Review/Calendário)
    if (typeof setupAutoSave === "function") setupAutoSave();
    if (typeof loadMonthlyMemory === "function") loadMonthlyMemory();
};

function baixarResenha() {
    const resenha = document.querySelector('.journal-page');

    if (!resenha) {
        alert("Erro: Área da resenha não encontrada!");
        return;
    }

    // Captura a página do diário
    html2canvas(resenha, {
        backgroundColor: "#fffafa", // Cor de fundo que definimos no CSS
        scale: 2, // Aumenta a qualidade para os textos ficarem nítidos
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'minha-resenha-livro.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

async function partilharDiario() {
    const elemento = document.querySelector('.album-container') || document.querySelector('.journal-page');
    
    // 1. Primeiro criamos a imagem (mesma lógica do download)
    const canvas = await html2canvas(elemento, { scale: 2 });
    const dataUrl = canvas.toDataURL("image/png");
    
    // 2. Convertemos a imagem para um arquivo real que o telemóvel entenda
    const blob = await (await fetch(dataUrl)).blob();
    const arquivo = new File([blob], 'meu-diario.png', { type: 'image/png' });

    // 3. Verificamos se o navegador suporta partilha
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Meu Diário 2026',
                text: 'Olha só o que registei hoje!',
                files: [arquivo]
            });
        } catch (err) {
            console.log("Erro ao partilhar:", err);
        }
    } else {
        alert("A partilha direta não é suportada neste navegador. Use o botão de Baixar!");
    }
}

// 1. FUNÇÕES DE UPLOAD E TROCA DE FOTO
function triggerUpload(slot) {
    const input = slot.querySelector('input');
    input.click();
}

function previewImage(event, input) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const slot = input.parentElement;
            const slotId = slot.getAttribute('data-id');
            
            let img = slot.querySelector('img');
            if (!img) {
                img = document.createElement('img');
                slot.appendChild(img);
                if (slot.querySelector('.number')) slot.querySelector('.number').style.display = 'none';
            }
            img.src = e.target.result;
            localStorage.setItem('img_slot_' + slotId, e.target.result);
        }
        reader.readAsDataURL(file);
    }
}

// 2. FUNÇÃO PARA BAIXAR E PARTILHAR
async function baixarResenha() {
    const elemento = document.querySelector('.journal-page');
    const canvas = await html2canvas(elemento, { backgroundColor: "#fffafa", scale: 2 });
    const link = document.createElement('a');
    link.download = 'minha-resenha.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
}

async function partilharDiario() {
    const elemento = document.querySelector('.journal-page') || document.querySelector('.album-container');
    const canvas = await html2canvas(elemento, { scale: 2 });
    const dataUrl = canvas.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();
    const arquivo = new File([blob], 'meu-diario.png', { type: 'image/png' });

    if (navigator.share) {
        navigator.share({ title: 'Meu Diário', files: [arquivo] });
    } else {
        alert("Partilha não suportada. Use o botão Guardar!");
    }
}

// 3. AUTO-SALVAMENTO E CARREGAMENTO
function setupAutoSave() {
    document.querySelectorAll('input, textarea').forEach(field => {
        if (!field.id) return;
        field.value = localStorage.getItem('text_' + field.id) || "";
        field.addEventListener('input', () => {
            localStorage.setItem('text_' + field.id, field.value);
        });
    });
}

function loadImages() {
    document.querySelectorAll('.slot').forEach(slot => {
        const slotId = slot.getAttribute('data-id');
        const saved = localStorage.getItem('img_slot_' + slotId);
        if (saved) {
            if (slot.querySelector('.number')) slot.querySelector('.number').style.display = 'none';
            let img = document.createElement('img');
            img.src = saved;
            slot.appendChild(img);
        }
    });
}

function resetReview() {
    if (confirm("Deseja limpar todos os textos e a capa desta resenha?")) {
        // Limpa os campos de texto
        const ids = ['rev-title', 'rev-author', 'rev-rating', 'rev-summary', 'rev-quotes', 'rev-thoughts'];
        ids.forEach(id => localStorage.removeItem('text_' + id));
        
        // Limpa a foto da capa
        localStorage.removeItem('img_slot_book-cover');
        
        location.reload(); // Recarrega para limpar a tela
    }
}

// Função para baixar a imagem do calendário quadriculado
async function baixarCalendario() {
    const elemento = document.querySelector('.calendar-container');
    
    if (!elemento) {
        alert("Área do calendário não encontrada!");
        return;
    }

    const canvas = await html2canvas(elemento, {
        backgroundColor: "#f8f4f9",
        scale: 2 // Alta qualidade
    });
    
    const link = document.createElement('a');
    link.download = `memorias-${document.getElementById('monthSelect').value}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

// Função para limpar apenas o texto do mês atual
function resetCalendario() {
    const mes = document.getElementById('monthSelect').value;
    const nomeMes = document.getElementById('monthSelect').options[document.getElementById('monthSelect').selectedIndex].text;
    
    if (confirm(`Deseja apagar todas as memórias de ${nomeMes}?`)) {
        localStorage.removeItem('memo_' + mes); // Remove apenas a chave do mês atual
        document.getElementById('month-text').value = ""; // Limpa a tela
    }
}

// INICIALIZAÇÃO
window.onload = () => {
    loadImages();
    setupAutoSave();
    if (typeof loadMonthlyMemory === "function") loadMonthlyMemory();
};