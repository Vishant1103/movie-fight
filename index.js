const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? '' : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})	
        `
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchInput) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: 'be948909',
                s: searchInput
            }
        });
        //if no match found return empty array
        if(response.data.Response === "False"){
            return [];
        }
        else
            return response.data.Search;
    }
}

createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});

createAutocomplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'be948909',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);
    if(side === 'left')
        leftMovie = response.data;
    if(side === 'right')
        rightMovie = response.data;

    if(leftMovie && rightMovie){
        runComparision();
    }
}

const runComparision = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);
        
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } 
        else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
}

const movieTemplate = (movieDetail) => {
    const dollars = parseInt((movieDetail.BoxOffice.replace(/\$/g, '')).replace(/,/g, ''));
    const metaScore = parseInt(movieDetail.Metascore);
    const rating = parseFloat(movieDetail.imdbRating);
    const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value =parseInt(word);
        if(value === NaN) return prev;
        return value + prev;
        }, 0);

    return `
        <article class = "media">
            <figure class = "media-left">
                <p class = "image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class = "media-content">
                <div class = "content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div> 
            </div>
        </article>
        <article data-value = ${awards} class = "notification is-primary">
            <p class = "title">${movieDetail.Awards}</p>
            <p class = "subtitle">Awards</p>  
        </article> 
        <article data-value = ${dollars} class = "notification is-primary">
            <p class = "title">${movieDetail.BoxOffice}</p>
            <p class = "subtitle">Box Office</p>  
        </article> 
        <article data-value = ${metaScore} class = "notification is-primary">
            <p class = "title">${movieDetail.Metascore}</p>
            <p class = "subtitle">Metascore</p>  
        </article> 
        <article data-value = ${rating} class = "notification is-primary">
            <p class = "title">${movieDetail.imdbRating}</p>
            <p class = "subtitle">IMDb Rating</p>  
        </article> 
        <article data-value = ${votes} class = "notification is-primary">
            <p class = "title">${movieDetail.imdbVotes}</p>
            <p class = "subtitle">IMDb Votes</p>  
        </article> 
    `
}