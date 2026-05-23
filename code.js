    document.addEventListener('DOMContentLoaded', () => {
        const savedData = localStorage.getItem('cartItems');
        let items = savedData ? JSON.parse(savedData) : [
        { id: 1, name: 'Помідори', amount: 2, isBought: true },
        { id: 2, name: 'Печиво', amount: 2, isBought: false },
        { id: 3, name: 'Сир', amount: 1, isBought: false }
    ];
        const productsContainer = document.querySelector('.products');
        const form = document.querySelector('form');
        const inputField = document.getElementById('q');
        const leftStatsContainer = document.querySelector('.statement:nth-child(1) .items');
        const rightStatsContainer = document.querySelector('.statement:nth-child(2) .items');
        function render() {
            localStorage.setItem('cartItems', JSON.stringify(items));
            productsContainer.innerHTML = '';
            leftStatsContainer.innerHTML = '';
            rightStatsContainer.innerHTML = '';

            items.forEach(item => {
                const li = document.createElement('li');
                li.className = item.isBought ? 'product product_is_bought' : 'product';
             li.dataset.id = item.id;
                const controlsHtml = item.isBought ? '' : `
                    <button class="plus" data-tooltip="Збільшити">+</button>
                    <button class="minus" data-tooltip="Зменшити" ${item.amount <= 1 ? 'disabled' : ''}>-</button>
                `;
                const deleteHtml = item.isBought ? '' : `
                    <button class="delete" data-tooltip="Видалити зі списку">×</button>
                `;
                li.innerHTML = `
                    <span class="product_name" ${!item.isBought ? 'style="cursor: pointer;" title="Натисніть, щоб редагувати"' : ''}>${item.name}</span>
                    <div class="amount_for_prod">
                        <span class="amount">${item.amount}</span>
                        ${controlsHtml}
                        <select name="measure" aria-label="Одиниця виміру">
                            <option value="kg">кг</option>
                            <option value="piece">шт</option>
                            <option value="packaging">уп</option>
                            <option value="liter">л</option>
                        </select>
                    </div>
                    <div class="statuses">
                        <button class="status" data-tooltip="Змінити статус">${item.isBought ? 'Не куплено' : 'Куплено'}</button>
                        ${deleteHtml}
                    </div>
                `;
                productsContainer.appendChild(li);
                const statSpan = document.createElement('span');
                statSpan.className = item.isBought ? 'item is-bought' : 'item';
                statSpan.innerHTML = `
                    <span class="item_name">${item.name}</span>
                    <span class="item_count">${item.amount}</span>
                `;

                if (item.isBought) {
                    rightStatsContainer.appendChild(statSpan);
                } else {
                    leftStatsContainer.appendChild(statSpan);
                }
            });
        }
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const name = inputField.value.trim();
        
            if (name) {
                items.push({
                    id: Date.now(), 
                    name: name,
                    amount: 1,
                    isBought: false
                });
                inputField.value = '';
                inputField.focus(); 
                render();
            }
        });
        productsContainer.addEventListener('click', (e) => {
            const li = e.target.closest('.product');
            if (!li) return;
    
            const id = parseInt(li.dataset.id);
            const item = items.find(i => i.id === id);
            if (!item) return;
            if (e.target.classList.contains('delete')) {
                items = items.filter(i => i.id !== id);
                render();
            }
            if (e.target.classList.contains('status')) {
                item.isBought = !item.isBought;
                render();
            }
            if (e.target.classList.contains('plus')) {
                item.amount++;
                render();
            }
            if (e.target.classList.contains('minus')) {
                if (item.amount > 1) {
                    item.amount--;
                    render();
                }
            }
            if (e.target.classList.contains('product_name') && !item.isBought) {
                const span = e.target;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = item.name;
                span.replaceWith(input);
                input.focus();
                const saveName = () => {
                    const newName = input.value.trim();
                    if (newName) {
                        item.name = newName;
                    }
                    render(); 
                };
                input.addEventListener('blur', saveName);
                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        saveName();
                    }
                });
            }
        });
        render();
    });