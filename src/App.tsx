import { FormEvent, useEffect, useLayoutEffect, useState } from 'react'
import './App.css'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'

interface DataItem {
  word: string
  score: number
  tags: string[]
}

function App() {
  const [data, setData] = useState<DataItem[]>()
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') || 'false')

  // const root = document.getElementById('root') // ! possibly null error
  const root = document.getElementsByTagName('html')[0] // ! no possibly null error?

  const handleToggleTheme = () => {
    if (darkTheme === 'true') {
      setDarkTheme('false')
    }
    if (darkTheme === 'false') {
      setDarkTheme('true')
    }
  }

  // Theme - Apple app/website theme (light/dark theme)
  const applyTheme = () => {
    // check system preference:
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    console.log({ prefersDark }) // prefersDark: false
    // check saved app/website theme preference:
    const localDarkTheme = localStorage.getItem('theme')
    console.log({ localDarkTheme }) // localTheme: null

    // if system preference dark theme and have not set app/website theme (e.g. first time visit) -> set dark theme
    if (prefersDark && localDarkTheme == null) {
      console.log('run prefersDark && localDarkTheme == null')
      localStorage.setItem('theme', 'true')
      setDarkTheme('true')
    }
  }

  // Theme - Set app/page theme on page load (paints the app before it renders elements)
  useLayoutEffect(() => {
    console.log('LAYOUT EFFECT')
    applyTheme()
  }, [])

  // Theme - Toggle theme on theme state change (toggle button)
  useEffect(() => {
    // if currently on dark theme -> switch to light theme
    if (darkTheme === 'true') {
      console.log('run IF DARKTHEME = TRUE')
      root.classList.add('dark')
      localStorage.setItem('theme', 'true')
    }
    // if currently on light theme -> switch to dark theme
    if (darkTheme === 'false') {
      console.log('run IF DARKTHEME = FALSE')
      root.classList.remove('dark')
      localStorage.setItem('theme', 'false')
    }
  }, [darkTheme])

  // Fetch data
  const fetchData = async (word: string) => {
    const parsedSearchInput = word.split(' ').join('+')
    console.log({ word }) // {parsedSearchInput: 'snow+village'}

    setIsLoading(true)

    try {
      // ml - Means like constraint
      // const response = await fetch(`https://api.datamuse.com/words?ml=${parsedSearchInput}`)

      // jja - Popular nouns modified by the given adjective, per Google Books Ngrams	gradual → increase

      // jjb - Popular adjectives used to modify the given noun, per Google Books Ngrams	beach → sandy
      // const response = await fetch(`https://api.datamuse.com/words?rel_jjb=${parsedSearchInput}`)

      // rel_syn
      // Synonyms: // ocean → sea
      // const response = await fetch(`https://api.datamuse.com/words?rel_syn=${parsedSearchInput}`)
      console.log('fetching data with word:', parsedSearchInput)

      const response = await fetch(
        `https://api.datamuse.com/words?rel_syn=${parsedSearchInput}`
      )
      const data = await response.json()
      setData(data)
      console.log('data fetch:', data)
      //     [
      //       {
      //           "word": "igloo",
      //           "score": 10604,
      //           "tags": [
      //               "n"
      //           ]
      //       },
      //       {
      //           "word": "rainfall",
      //           "score": 10604,
      //           "tags": [
      //               "n"
      //           ]
      //       },
    } catch (error) {
      console.log(error)
      alert('Error fetching results')
    }
    setIsLoading(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    fetchData(searchInput)
  }

  const handleClickWord = (newWord: string) => {
    setSearchInput(newWord)
    fetchData(newWord)
  }

  return (
    <div className='App'>
      <ThemeToggle darkTheme={darkTheme} handleToggleTheme={handleToggleTheme} />

      <h1>Thesaurus App w/ Datamuse API</h1>
      <form className='form' onSubmit={handleSubmit}>
        {/* <label htmlFor='search-input'>Find words with a similar meaning to:</label> */}
        <label htmlFor='search-input'>Find synonyms for the word:</label>
        <input
          value={searchInput}
          placeholder='e.g. amazing'
          type='search'
          name='search-input'
          id='search-input'
          className='search-input'
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>
      {/* if loading - show loading */}
      {isLoading && <h3 className='loading'>Loading...</h3>}
      {/* if entered search value, completed loading, fetched no data - show no results */}
      {searchInput && !isLoading && data?.length === 0 && <h3>No Results</h3>}
      {/* if completed loading, have data - show data */}
      {!isLoading && data && (
        <ul className='result-list'>
          {data.map((item: DataItem) => (
            <li
              key={item.word}
              className='result-word'
              onClick={() => handleClickWord(item.word)}
            >
              {item.word}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
