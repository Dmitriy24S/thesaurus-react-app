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

  const fetchData = async (e: FormEvent) => {
    e.preventDefault()
    const parsedSearchInput = searchInput.split(' ').join('+')
    console.log({ parsedSearchInput }) // {parsedSearchInput: 'snow+village'}

    // ml - Means like constraint
    // const response = await fetch(`https://api.datamuse.com/words?ml=${parsedSearchInput}`)

    // jja - Popular nouns modified by the given adjective, per Google Books Ngrams	gradual → increase

    // jjb - Popular adjectives used to modify the given noun, per Google Books Ngrams	beach → sandy
    // const response = await fetch(`https://api.datamuse.com/words?rel_jjb=${parsedSearchInput}`)

    // Synonyms: // ocean → sea
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
  }

  return (
    <div className='App'>
      <h1>Thesaurus App w/ Datamuse API</h1>
      <form className='form' onSubmit={fetchData}>
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
      <ul className='result-list'>
        {data.map((item: DataItem) => (
          <li className='result-word'>{item.word}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
