import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { endpoints } from '../../endpoints/Endpoints';
import Thumb from './Thumb';

import BrandHeader from './BrandHeader';
import SeriesHeader from './SeriesHeader';
import CollectionHeader from './CollectionHeader';
import CompletedSection from './CompletedSection';

const initialState = {
  toys: [],
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        toys: action.payload,
        loading: false,
        error: null,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        toys: [],
        loading: false,
        error: action.payload,
      };
    case 'TOY_ADDED':
      return {
        ...state,
        toys: [...state.toys, action.payload],
      };
    default:
      return state;
  }
};

const ToysByCompanyContent = ({ rowHeight }) => {
  // const [toys, setToys] = useState([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        // Fetch data from the API endpoint using Axios
        const response = await axios.get(endpoints.API_URL + 'toys'); // Replace '/api/toys' with the actual endpoint URL
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    };

    fetchData();

  }, []);

  const { toys, loading, error } = state;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  

  if (!toys || toys.length === 0) {
    return null; // Handle the case when toys is undefined or empty
  }

  const groupToysByProperty = (toys, property) => {
    return toys.reduce((acc, toy) => {
      const key = toy[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(toy);
      return acc;
    }, {});
  };

  const groupToysByCompany = groupToysByProperty(toys, "company");
  const sortedCompanies = Object.keys(groupToysByCompany).sort((a, b) => a.localeCompare(b));

  const groupToysByBrand = (toys, company) => {
    const companyToys = groupToysByCompany[company];
    return groupToysByProperty(companyToys, "brand");
  };

  const groupToysBySeries = (toys, company, brand) => {
    const brandToys = groupToysByBrand(toys, company)[brand];
    return groupToysByProperty(brandToys, "series");
  };

  const groupToysByCollection = (toys, company, brand, series) => {
    const seriesToys = groupToysBySeries(toys, company, brand)[series];
    return groupToysByProperty(seriesToys, "collection");
  };

  const groupToysByCompleted = (toys, company, brand, series, collection) => {
    const collectionToys = groupToysByCollection(toys, company, brand, series)[collection];
    return groupToysByProperty(collectionToys, "completed");
  };

  return (
    <div className="scrollable-content">
      <div className="toy-list-by-company">
      
      {sortedCompanies.map((company, i) => (
        <React.Fragment key={i}>

          <div className="company-header">{company}</div>

          {Object.keys(groupToysByBrand(toys, company))
            .sort((a, b) => a.localeCompare(b))
            .map((brand, i) => (
              <React.Fragment key={i}>
                
                {Object.keys(groupToysBySeries(toys, company, brand))
                  .sort((a, b) => a.localeCompare(b))
                  .map((series, i) => (
                    <React.Fragment key={i}>
                      
                      {Object.keys(groupToysByCollection(toys, company, brand, series))
                        .sort((a, b) => a.localeCompare(b))
                        .map((collection, i) => (
                          <React.Fragment key={i}>
                            {Object.keys(groupToysByCompleted(toys, company, brand, series, collection))
                              .sort((a, b) => a.localeCompare(b))
                              .map((completed, i) => {
                                const totalToys = groupToysByCompleted(toys, company, brand, series, collection)[completed].reduce((a, v) => a + v.quantity, 0);
                                return (
                                  <React.Fragment key={i}>
                                    <div className="titles-containers">
                                      <div className="titles__wrapper">
                                        <BrandHeader brand={brand} />
                                        {series && <SeriesHeader series={series} />}
                                        {collection && <CollectionHeader collection={collection} />}
                                        {completed === 'Yes' && <CompletedSection completed={completed} />}
                                      </div>
                                      <div className="toy__count">
                                        <div className="toy__count-txt">Number in<br /> Collection</div>
                                        <div className="toy__count-total">{totalToys}</div>
                                      </div>
                                    </div>
                                    <div className="thumbs_wrapper">
                                      {groupToysByCompleted(toys, company, brand, series, collection)[completed].map((toy) => (
                                        <Thumb key={toy.id} toy={toy} rowHeight={rowHeight} />
                                      ))}
                                    </div>
                                  </React.Fragment>
                                );
                              })}
                          </React.Fragment>
                        ))}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
        </React.Fragment>
      ))}
      
    </div>
    </div>
  );
};

export default ToysByCompanyContent;
