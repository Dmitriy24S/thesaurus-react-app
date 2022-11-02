import { FormEvent, useState } from 'react'
import './App.css'

interface DataItem {
  word: string
  score: number
  tags: string[]
}

function App() {
  const [data, setData] = useState<DataItem[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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

      const response = await fetch(`https://api.datamuse.com/words?rel_syn=${parsedSearchInput}`)
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
      <h1>Thesaurus App w/ Datamuse API</h1>
      <form className='form' onSubmit={handleSubmit}>
        {/* <label htmlFor='search-input'>Find words with a similar meaning to:</label> */}
        <label htmlFor='search-input'>Find synonyms for the word:</label>
        <input
          value={searchInput}
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
      {searchInput && !isLoading && data.length === 0 && <h3>No Results</h3>}
      {/* if completed loading, have data - show data */}
      {!isLoading && data && (
        <ul className='result-list'>
          {data.map((item: DataItem) => (
            <li key={item.word} className='result-word' onClick={() => handleClickWord(item.word)}>
              {item.word}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
