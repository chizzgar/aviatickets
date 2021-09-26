import { useEffect, useState, useCallback } from 'react';
import './App.css';
import Result from './Result';
import flights from './flights';

// const mock = [{
//   company: "goofle",
//   price: 1230,
//   flights: [
//     {
//       from: {
//         name: "Hilton",
//         code: "HLT",
//       },
//       to: {
//         name: "Moscow",
//         code: "MSK",
//       },
//       company: "gooofle2",
//       departureDate: new Date(new Date().valueOf() - 1000 * 60 * 60 * 12.5).toISOString(),
//       arrivalDate: new Date().toISOString(),
//       transfers: 2
//     },
//     {
//       from: {
//         name: "Hilton",
//         code: "HLT",
//       },
//       to: {
//         name: "Moscow",
//         code: "MSK",
//       },
//       company: "gooofle2",
//       departureDate: new Date(new Date().valueOf() - 1000 * 60 * 60 * 12.5).toISOString(),
//       arrivalDate: new Date().toISOString(),
//       transfers: 2
//     }
//   ],
// }];

const source = (filters, limit) => {
  let data = flights.result.flights.map(i => {
    console.log(i.flight.legs.map(leg => {
      const firstFlight = leg.segments[0];
      const lastFlight = leg.segments[leg.segments.length - 1];

      return new Date(lastFlight.arrivalDate).valueOf() - new Date(firstFlight.departureDate).valueOf();
    }));

    return {
      company: i.flight.carrier.caption,
      price: parseInt(i.flight.price.total.amount),

      flights: i.flight.legs.map(leg => {
        const firstFlight = leg.segments[0];
        const lastFlight = leg.segments[leg.segments.length - 1];

        return {
          from: {
            name: firstFlight.departureCity?.caption + ', ' + firstFlight.departureAirport?.caption,
            code: firstFlight.departureAirport?.uid,
          },
          to: {
            name: lastFlight.arrivalCity?.caption + ', ' + lastFlight.arrivalAirport?.caption,
            code: lastFlight.arrivalAirport?.uid,
          },
          company: firstFlight.airline.caption,
          departureDate: firstFlight.departureDate,
          arrivalDate: lastFlight.arrivalDate,
          transfers: leg.segments.length - 1,
        }
      }),

      duration: Math.max(...i.flight.legs.map(leg => {
        const firstFlight = leg.segments[0];
        const lastFlight = leg.segments[leg.segments.length - 1];

        return new Date(lastFlight.arrivalDate).valueOf() - new Date(firstFlight.departureDate).valueOf();
      }))
    }
  });

  if (filters.sort !== 'time') {
    data = data.sort((a, b) => {
      const multiplier = filters.sort === 'price_asc' ? 1 : -1;

      return (a.price > b.price ? multiplier : a.price < b.price ? (-1) * multiplier : 0);
    })
  } else {
    data = data.sort((a, b) => {
      return (a.duration > b.duration ? 1 : a.duration < b.duration ? -1 : 0);
    })
  }

  return Promise.resolve({
    data, presets: flights.result.bestPrices
  });
}

function App() {
  const [limit, setLimit] = useState(2);
  const [data, setData] = useState();
  const [presets, setPresets] = useState();

  const [filters, setFilters] = useState({
    sort: "price_asc", // "price_asc", "price_desc", "time",

    price: {
      min: 0,
      max: 10000,
    },

    transfers: null,

    companies: [],
  });

  useEffect(() => {
    setLimit(2);

    source(filters).then(({ data, presets }) => {
      setData(data);
      setPresets(presets);
    })
  }, [filters]);

  const changePrice = useCallback(e => {
    const { name, value } = e.currentTarget;

    setFilters(filters => {
      return {
        ...filters,

        price: {
          ...filters.price,

          [name]: value
        }
      }
    });
  });

  const changeSort = useCallback(e => {
    const { name, value } = e.currentTarget;

    setFilters(filters => {
      return {
        ...filters,

        [name]: value
      }
    });
  });

  return (
    <div className="container">
      <div className="sidebar">
        <div style={{ backgroundColor: '#FFFFFF', marginTop: '40px', paddingTop: '25px', paddingBottom: '25px', paddingLeft: "30px" }}>
          <div className="sort">
            <h3>Сортировать</h3>

            <div><input checked={filters.sort === "price_asc"} type="radio" name="sort" value={"price_asc"} onChange={changeSort} /> &mdash; по возрастанию цены</div>
            <div><input checked={filters.sort === "price_desc"} type="radio" name="sort" value={"price_desc"} onChange={changeSort} /> &mdash; по убыванию цены</div>
            <div><input checked={filters.sort === "time"} type="radio" name="sort" value={"time"} onChange={changeSort} /> &mdash; пог времени в пути</div>
          </div>

          <div className="filter">
            <h3>Фильтровать</h3>
            <div><input type="checkbox" /> &mdash; 1 пересадка</div>
            <div><input type="checkbox" /> &mdash; без пересадок</div>
          </div>

          <div className="price">
            <h3>Цена</h3>

            <div>От <input type="text" name="min" value={filters.price.min} onChange={changePrice} /></div>
            <div>До <input type="text" name="max" value={filters.price.max} onChange={changePrice} /></div>

            <div className="avia_comps">
              <h3>Авиакомпании</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="main">

        {data?.slice(0, limit).map(result => (
          <Result
            {...result}
          />
        ))}
        <div className="convertBtn"><button className="btnMore" onClick={() => setLimit(limit + 2)}>Показать еще</button></div>
      </div>
    </div>

  );
}

export default App;
