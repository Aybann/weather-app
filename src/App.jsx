import clearIcon from './assets/clear.png'
import cloudIcon from './assets/cloud.png'
import drizzleIcon from './assets/drizzle.png'
import rainIcon from './assets/rain.png'
import snowIcon from './assets/snow.png'
import { useState, useRef, useEffect } from 'react';

function App() {
  const weatherTypes = [
    {
      "type": "clear", 
      "icon": clearIcon
    }, 
    {
      "type": "clouds", 
      "icon": cloudIcon
    }, 
    {
      "type": "snow", 
      "icon": snowIcon
    }, 
    {
      "type": "drizzle", 
      icon: drizzleIcon
    }, 
    {
      "type": "rain", 
      "icon": rainIcon
    }
  ]
  const key = '05036f352c3bdb86db2ee41595403e80'
  const element = document.documentElement;
  const searchRef = useRef()
  const [isDark, setIsDark] = useState(false)
  const [data , setData] = useState(
    {
      "coord": {
        "lon": 120.9169,
        "lat": 14.4825
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03n"
        }
      ],
      "base": "stations",
      "main": {
        "temp": 301.42,
        "feels_like": 307.38,
        "temp_min": 300.44,
        "temp_max": 302.2,
        "pressure": 1009,
        "humidity": 88
      },
      "visibility": 10000,
      "wind": {
        "speed": 4.63,
        "deg": 250
      },
      "clouds": {
        "all": 40
      },
      "dt": 1696250652,
      "sys": {
        "type": 1,
        "id": 8160,
        "country": "PH",
        "sunrise": 1696196750,
        "sunset": 1696239950
      },
      "timezone": 28800,
      "id": 1717641,
      "name": "Cavite City",
      "cod": 200
    }
  )
  const [date, setDate] = useState()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)

  const handleFormatDate = () => {
    const currentDate = new Date();
   
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const day = currentDate.getDate();
    const month = monthNames[currentDate.getMonth()];
    const dayOfWeek = dayNames[currentDate.getDay()];
    const formattedDate = day + " " + month + " " + dayOfWeek;
    setDate(formattedDate)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setIsPending(true)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchRef.current.value}&appid=${key}`)
    .then(res => {
      if(!res.ok){
        throw Error("Could not get the data the resources")
      }
      return res.json()
    }).then(data => {
      setData(data)
      setIsPending(false)
      setError(null)
    }).catch(err => {
       setData(null)
      setIsPending(false)
      setError(err.message)
    })
    console.log(searchRef.current.value);
  }

  const handleToggleDark = () => {
    if(isDark){
      setIsDark(false)   
    } else {
      setIsDark(true)
    }
  }
  
  const handleConvertTemperature = (fahrenheit) => {
    const celsius = ((fahrenheit - 32) * 5 / 9 ).toFixed(2);
    return `${celsius}°C`
  }

  const unixTimestampToSunrise = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
  
    const sunriseTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return `${sunriseTime}`;
  }

  const unixTimestampToSunset = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
  
    const sunsetTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
    return `${sunsetTime}`;
  }

  useEffect(() => {
    handleFormatDate()
    if(isDark){
      element.classList.add('dark')
    } else {
      element.classList.remove('dark')
    }
  },[isDark])

  return (
    <main className="py-6 px-4 ">
      <header className="flex flex-col md:flex-row justify-stretch gap-2 pb-4 md:w-[1170px] mx-auto dark:text-white">
        <div className="border border-gray-400 bg-gray-50 font-semibold p-3 rounded-md flex items-center justify-center gap-2 basis-[20%] dark:bg-gray-900">
          <svg className="h-5 w-5 iconColor"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M7 18a4.6 4.4 0 0 1 0 -9h0a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-12" /></svg>
          Weather App
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 basis-[90%]">
          <div className="border border-gray-400 bg-gray-50 p-3 rounded-md flex items-center gap-2 w-full dark:bg-gray-900 dark:text-gray-200">
            <svg className="h-5 w-5 iconColor"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <circle cx="11" cy="11" r="8" />  <line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input ref={searchRef} type="search" placeholder="Enter a City" className="outline-none w-full bg-transparent"/>
          </div>
          <button type="submit" className="border border-gray-400 bg-gray-50 p-3 rounded-md dark:bg-gray-900">
            <svg className="h-5 w-5 iconColor"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </form>
        <div className="flex flex-row-reverse md:flex-row gap-2 basis-[30%]">
          <button type="button" onClick={handleToggleDark} className="border border-gray-400 bg-gray-50 p-3 rounded-md dark:bg-gray-900">
            {
              isDark 
              ?<svg className="h-6 w-6 iconColor"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              : <svg className="h-6 w-6 iconColor"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M16.2 4a9.03 9.03 0 1 0 3.9 12a6.5 6.5 0 1 1 -3.9 -12" /></svg>
            }
          </button>
          <a href="https://github.com/Aybann" target='_blank' className="bg-gradient-to-r from-violet-200 to-pink-100 p-3 rounded-md font-semibold flex items-center gap-2 w-full justify-center md:w-fit dark:from-violet-500 dark:to-pink-500">
            <svg className="h-5 w-5 iconColor"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 19c-4.286 1.35-4.286-2.55-6-3m12 5v-3.5c0-1 .099-1.405-.5-2 2.791-.3 5.5-1.366 5.5-6.04a4.567 4.567 0 0 0 -1.333 -3.21 4.192 4.192 0 00-.08-3.227s-1.05-.3-3.476 1.267a12.334 12.334 0 0 0 -6.222 0C6.462 2.723 5.413 3.023 5.413 3.023a4.192 4.192 0 0 0 -.08 3.227A4.566 4.566 0 004 9.486c0 4.64 2.709 5.68 5.5 6.014-.591.589-.56 1.183-.5 2V21" /></svg>
            Support Project
          </a>
        </div>
      </header>
      <div className="md:w-[1170px] mx-auto border border-gray-400 py-10 px-10 rounded-md bg-gray-50 dark:bg-gray-900 dark:text-white">
        <section>
          <header>
            <h1 className="text-3xl font-semibold">Today Overview</h1>
          </header>
          { error && 
            <div className='h-[100px] text-center font-bold'> 
              { error }! Make sure your Search the right place! 
            </div> 
          }
          { isPending && <div className='h-[100px] text-center font-bold'> Loading...</div> }
          { 
            data &&
            <section className="py-4 font-semibold flex flex-col gap-2 md:flex-row">
              <div className=" p-8 rounded-md flex justify-between gap-4 flex-col basis-[25%] border border-gray-400">
                <div className="">
                  {
                    weatherTypes.filter((weatherType) => 
                      weatherType.type === data.weather[0].main.toLowerCase()
                    ).map((filterItems, index) => (
                      <img key={index} src={filterItems.icon} alt="" className='w-32'/>
                    ))
                  }          
                  <p className="text-4xl mt-4 mb-1 ">{handleConvertTemperature(data.main.temp)}</p>
                  <p>{data.weather[0].main}</p>
                </div>
                <div className='h-[0.5px] bg-gray-500'></div>
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <svg className="h-5 w-5 iconColor"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {data.name}
                  </div>
                  <div className="flex gap-2 items-center">
                    <svg className="h-5 w-5 iconColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill={`${isDark ? '#fff' : '#000'}`} d="M8 14q-.425 0-.713-.288T7 13q0-.425.288-.713T8 12q.425 0 .713.288T9 13q0 .425-.288.713T8 14Zm4 0q-.425 0-.713-.288T11 13q0-.425.288-.713T12 12q.425 0 .713.288T13 13q0 .425-.288.713T12 14Zm4 0q-.425 0-.713-.288T15 13q0-.425.288-.713T16 12q.425 0 .713.288T17 13q0 .425-.288.713T16 14ZM5 22q-.825 0-1.413-.588T3 20V6q0-.825.588-1.413T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.588 1.413T19 22H5Zm0-2h14V10H5v10Z"/>
                    </svg>
                    {date}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 basis-[50%]">
                <div className="flex flex-col justify-center items-center text-center border border-gray-400 p-4 rounded-md gap-5 md:flex-row md:justify-start md:text-left">
                  <svg class="h-8 w-8 iconColor"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M5 8h8.5a2.5 2.5 0 1 0 -2.34 -3.24" />  <path d="M3 12h15.5a2.5 2.5 0 1 1 -2.34 3.24" />  <path d="M4 16h5.5a2.5 2.5 0 1 1 -2.34 3.24" /></svg>
                  <div>
                    <p className="text-sm text-gray-400">Wind Speed</p>
                    <p className="text-2xl">{data.wind.speed} km/h</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center border border-gray-400 p-4 rounded-md gap-5 md:flex-row md:justify-start md:text-left">
                  <svg className="h-8 w-8 iconColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill={`${isDark ? '#fff' : '#000'}`} d="M12 21.5q-3.325 0-5.663-2.3T4 13.6q0-1.575.613-3.012T6.35 8.05L12 2.5l5.65 5.55q1.125 1.1 1.738 2.538T20 13.6q0 3.3-2.337 5.6T12 21.5Zm-6-7.9h12q0-1.175-.45-2.237T16.25 9.5L12 5.3L7.75 9.5q-.85.8-1.3 1.863T6 13.6Z"/>
                  </svg>
                  <div>
                    <p className="text-sm text-gray-400">Humidity</p>
                    <p className="text-2xl"> {data.main.humidity}%</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center border border-gray-400 p-4 rounded-md gap-5 md:flex-row md:justify-start md:text-left">
                  <svg className="h-8 w-8 iconColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path fill={`${isDark ? '#fff' : '#000'}`} d="M8 1a8 8 0 0 1 3.875 15h-7.75A8 8 0 0 1 8 1zm4.53 12.53A6.364 6.364 0 0 0 14.406 9H13V8h1.329a6.346 6.346 0 0 0-.665-2H12V5h1.004a6.372 6.372 0 0 0-3.005-2.089V4h-1V2.671a6.506 6.506 0 0 0-2 0V4h-1V2.911A6.384 6.384 0 0 0 2.994 5h1.004v1H2.334a6.346 6.346 0 0 0-.665 2h1.329v1H1.592c0 1.711.666 3.32 1.876 4.53c.167.167.343.324.524.47h3.006l.571-8h.857l.571 8h3.006c.182-.146.357-.303.524-.47z"/>
                  </svg>
                  <div>
                    <p className="text-sm text-gray-400">Pressure</p>
                    <p className="text-2xl">{data.main.pressure} hPa</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center border border-gray-400 p-4 rounded-md gap-5 md:flex-row md:justify-start md:text-left">
                  <svg className="h-8 w-8 iconColor"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <line x1="16" y1="13" x2="16" y2="21" />  <line x1="8" y1="13" x2="8" y2="21" />  <line x1="12" y1="15" x2="12" y2="23" />  <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" /></svg>
                  <div>
                    <p className="text-sm text-gray-400">Visibility</p>
                    <p className="text-2xl">{data.visibility} km</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center border border-gray-400 p-4 rounded-md gap-5 md:flex-row md:justify-start md:text-left">
                <svg class="h-8 w-8 iconColor"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M3 17h1m16 0h1M5.6 10.6l.7.7m12.1-.7l-.7.7M8 17a4 4 0 0 1 8 0" />  <line x1="3" y1="21" x2="21" y2="21" />  <path d="M12 9v-6l3 3m-6 0l3 -3" /></svg>
                  <div>
                    <p className="text-sm text-gray-400">Sunrise</p>
                    <p className="text-2xl"> {unixTimestampToSunrise(data.sys.sunrise)} </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center  border border-gray-400 p-4 rounded-md gap-5 md:flex-row md:justify-start md:text-left">
                  <svg className="h-8 w-8 iconColor"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M17 18a5 5 0 0 0-10 0" />  <line x1="12" y1="9" x2="12" y2="2" />  <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />  <line x1="1" y1="18" x2="3" y2="18" />  <line x1="21" y1="18" x2="23" y2="18" />  <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />  <line x1="23" y1="22" x2="1" y2="22" />  <polyline points="16 5 12 9 8 5" /></svg>
                  <div>
                    <p className="text-sm text-gray-400">Sunset</p>
                    <p className="text-2xl"> {unixTimestampToSunset(data.sys.sunset)} </p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-400 flex flex-col gap-4 justify-between  p-8 rounded-md basis-[25%] capitalize">
                <p className='text-2xl font-bold'>{data.weather[0].description} </p>
                <div>
                  <p className='text-2xl'> {data.clouds.all} </p>
                  <p className='text-sm text-gray-400'> Clouds </p> 
                </div>
                <div>
                  <p className='text-2xl'> {data.wind.deg}  </p>
                  <p className='text-sm text-gray-400'>  Wind Deg: </p> 
                </div>
                <div>
                  <p className='text-2xl'> {handleConvertTemperature(data.main.temp_min)}  </p>
                  <p className='text-sm text-gray-400'>  Temp min: </p> 
                </div>          
                <div>
                  <p className='text-2xl'> {handleConvertTemperature(data.main.temp_max)}  </p>
                  <p className='text-sm text-gray-400'>  Temp max: </p> 
                </div> 
              </div>
            </section>
          }
        </section>
      </div>
    </main>
  )
}

export default App
