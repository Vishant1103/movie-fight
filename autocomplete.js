const createAutocomplete = ({ root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData 
    }) => {
    root.innerHTML = `
        <label><b>Search for a movie</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu"> 
                <div class="dropdown-content results">
                </div>
            <div>
        </div> 
    `


    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultWrapper = root.querySelector('.results');

    //making request with debaouncing of function
    const onInput = debounce ( async (event) => {
        const items = await fetchData(event.target.value);
        //closing dropdown and return if no movies found
        if(!items.length){
            dropdown.classList.remove('is-active');
            return;
        }

        //clearing previous search results
        resultWrapper.innerHTML = "";

        //making dropdown active
        dropdown.classList.add('is-active');

        //looping over all movies and adding them to drowpdown list
        for(let item of items){
            const anchor = document.createElement('a');
            anchor.classList.add('dropdown-item');
            anchor.innerHTML = renderOption(item);

            anchor.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item);
            })
            
            resultWrapper.appendChild(anchor);
        }

    }, 500);

    //trigger the request as we enter input
    input.addEventListener('input', onInput);

    //closing the dropdown menu
    document.addEventListener('click', (event) => {
        if(!root.contains(event.target)){
            dropdown.classList.remove('is-active');
        }
    })

}
