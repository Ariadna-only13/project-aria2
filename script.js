// Client-side search and tag filtering
(function(){
    const input = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box .btn-primary');
    const servicesGrid = document.querySelector('.services-grid');
    const cards = Array.from(document.querySelectorAll('.services-grid .card'));
    const tags = Array.from(document.querySelectorAll('.tag'));
    const originalOrder = cards.slice();

    function normalize(s){
        return (s||'').toString().toLowerCase();
    }

    function resetCards(){
        // remove filtering classes and restore original order
        originalOrder.forEach(card => {
            card.classList.remove('filtered-out');
            card.style.display = '';
        });
        // restore order
        originalOrder.forEach(card => servicesGrid.appendChild(card));
    }

    const resultsContainer = document.getElementById('search-results');

    function filterCards(query){
        const q = normalize(query).trim();
        // clear previous results
        if(resultsContainer) resultsContainer.innerHTML = '';

        if(!q){
            // restore originals
            originalOrder.forEach(card => card.classList.remove('ghost'));
            // restore order
            originalOrder.forEach(card => servicesGrid.appendChild(card));
            return;
        }

        const matches = [];
        originalOrder.forEach(card => {
            const title = normalize(card.querySelector('h3')?.textContent);
            const desc = normalize(card.querySelector('p')?.textContent);
            const data = normalize(card.getAttribute('data-title'));
            if(title.includes(q) || desc.includes(q) || data.includes(q)){
                matches.push(card);
            }
        });

        // visually hide all originals but keep their layout space
        originalOrder.forEach(card => card.classList.add('ghost'));

        // render clones of matches into results container (so user sees only matches)
        if(matches.length && resultsContainer){
            matches.forEach(card => {
                const clone = card.cloneNode(true);
                clone.classList.remove('ghost');
                // ensure cloned links don't jump the page or duplicate ids
                const links = clone.querySelectorAll('a');
                links.forEach(a => a.setAttribute('href', '#contacts'));
                resultsContainer.appendChild(clone);
            });
            // scroll to results
            resultsContainer.scrollIntoView({behavior: 'smooth'});
        }
    }

    if(input){
        input.addEventListener('input', (e)=>{
            tags.forEach(t => t.classList.remove('active'));
            filterCards(e.target.value);
        });

        input.addEventListener('keydown', (e)=>{
            if(e.key === 'Enter'){
                e.preventDefault();
                filterCards(input.value);
            }
        });
    }

    if(searchBtn){
        searchBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            filterCards(input.value);
        });
    }

    tags.forEach(tag => {
        tag.addEventListener('click', ()=>{
            const t = tag.getAttribute('data-tag') || tag.textContent;
            input.value = t;
            tags.forEach(tg => tg.classList.remove('active'));
            tag.classList.add('active');
            filterCards(t);
            const services = document.getElementById('services');
            if(services) services.scrollIntoView({behavior: 'smooth'});
        });
    });

})();

// Contact modal handling
(function(){
    const modal = document.getElementById('contact-modal');
    const form = document.getElementById('contact-form');
    const serviceInput = document.getElementById('contact-service');
    const modalTitle = modal?.querySelector('.modal-content h3');

    function openModal(service){
        if(!modal) return;
        if(serviceInput) serviceInput.value = service || '';
        if(modalTitle) modalTitle.textContent = service ? `Зв'язатися — ${service}` : `Зв'язатися`;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden','false');
    }

    function closeModal(){
        if(!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden','true');
        // reset form
        if(form){
            form.reset();
            const success = document.getElementById('contact-success');
            if(success) success.style.display = 'none';
        }
    }

    // open modal when clicking a card 'Зв\'язатися' link
    document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', (e)=>{
            e.preventDefault();
            const card = link.closest('.card');
            const service = card?.getAttribute('data-title') || card?.querySelector('h3')?.textContent;
            openModal(service?.trim());
        });
    });

    // close handlers
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeModal));
    document.querySelectorAll('.modal-overlay').forEach(ov => ov.addEventListener('click', closeModal));

    // form submit (simulated)
    if(form){
        form.addEventListener('submit', (e)=>{
            e.preventDefault();
            // simulate send
            const success = document.getElementById('contact-success');
            if(success) success.style.display = 'block';
            // close after short delay
            setTimeout(()=>{
                closeModal();
            }, 1200);
        });
    }

})();
