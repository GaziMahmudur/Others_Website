// Member Management

function addMember() {
    const nameInput = document.getElementById('new-member-name');
    const name = nameInput.value.trim();
    if (!name) return;

    const newId = STATE.members.length > 0 ? Math.max(...STATE.members.map(m => m.id)) + 1 : 1;
    STATE.members.push({ id: newId, name: name, deposit: 0 });
    saveState();
    nameInput.value = '';
    renderMembers(document.getElementById('main-content'));
}

function deleteMember(id) {
    showModal({
        title: 'Delete Member?',
        message: 'This will remove the member. Are you sure?',
        type: 'confirm',
        confirmText: 'Delete',
        danger: true,
        onConfirm: () => {
            STATE.members = STATE.members.filter(m => m.id !== id);
            saveState();
            renderMembers(document.getElementById('main-content'));
        }
    });
}

function renderMembers(container) {
    container.innerHTML = `
        <h2 class="section-title">Manage Members</h2>
        
        <div class="surface-card surface-card-interactive input-group" style="display:flex; gap:10px;">
            <input type="text" id="new-member-name" class="input-field" placeholder="Enter Member Name">
            <button class="btn" onclick="addMember()">Add</button>
        </div>

        <div id="members-list">
            ${STATE.members.length === 0 ? `
                <div style="text-align:center; opacity:0.6; padding:40px;">
                    <span class="material-icons-round" style="font-size:48px; margin-bottom:10px;">group_add</span>
                    <p>No members yet.<br>Add your first member above!</p>
                </div>
            ` : ''}
            ${STATE.members.map(m => `
                <div class="surface-card surface-card-interactive row-pop" style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        ${getAvatar(m.name)}
                        <div style="font-weight:600;">${m.name}</div>
                    </div>
                    <button class="btn-icon-only" style="background: rgba(248,113,113,0.15); color: #f87171;" onclick="deleteMember(${m.id})">
                        <span class="material-icons-round">delete</span>
                    </button>
                </div>
            `).join('')}
        </div>
    `;

    // Add Enter key listener for new member input to trigger the button click
    const input = container.querySelector('#new-member-name');
    const button = container.querySelector('.btn');
    if (input && button) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                button.click();
            }
        });
    }
}
