
import { Provider } from 'react-redux'
import './App.css'
import { CarList } from './components/CarList'
import { Navbar } from './components/Navbar'
import store from './store/store'
import { PriceBox } from './components/PriceBox'

function App() {

  return (
    <Provider store={store}>
      <Navbar/>
      <CarList/>
      <PriceBox />
    </Provider>
  )
}

export default App
