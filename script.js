const movieSearchBox = document.getElementById('movie-search-box');
 const searchList = document.getElementById('search-list');/*These three lines select elements from the HTML document using document.getElementById() and manipulate That HTML element.*/
 const resultGrid = document.getElementById('result-grid');
 
 //load movies from API
 async function loadMovies(searchTerm){/*This function fetches movie data from the OMDb API based on the search term entered by the user.*/
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc8960e0`;//creating an url based on search term
    const res = await fetch(`${URL}`);//Sends an HTTP request to the OMDB API.
    const data = await res.json();//Convert the response data into a json file(readable form of javascript and full form is javascript object notation)
    //console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);//If the API responds with "True", it calls displayMovieList(data.Search) to display search results
}
 
function findMovies(){//This function trigger when user type in search box
    let searchTerm = (movieSearchBox.value).trim();//trim removes any leading and trailing whitespace from the input
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');//classList is javascript property that provides method to add,remove and toggle css class
        loadMovies(searchTerm);                         //hide-search-list class is likely a css class that applies style to hide the searchlist element and by removing this class the searchlist element become visible to the user.
    } else {
        searchList.classList.add('hide-search-list');//by adding this class searchlist element become invisible to the user
    }
}
/*.value is a property in JavaScript that retrieves the current value of an input field in a form.*/


function displayMovieList(movies){//movies is array of movie objects
    searchList.innerHTML = "";//clears the searchList before displaying the new result
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');//this creates a new div for each movies index and div will represent a single movie result in the search-list
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');//adds the css class (search-list-item) to the newly created div,this helps to style the search result item correctly
        if(movies[idx].Poster!= "N/A")   //if url of movie poster is present than it shows movie poster
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}"> 
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);//This adds the movieListItem <div> to the searchList container.
                                              //This makes the movie appear in the search results dropdown.
    }
    loadMovieDetails();
     //Calls the loadMovieDetails() function.
    // This function adds a click event listener to each search result item.
    //When a user clicks on a movie, its detailed info will be displayed.
    
}
//Movie Poster: Displayed inside <div class="search-item-thumbnail">.
//Movie Title & Year: Wrapped inside <div class="search-item-info">.
function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc8960e0`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}
function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});