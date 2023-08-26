import React from 'react';
import Thumb from './Thumb';
import BrandHeader from './BrandHeader';
import SeriesHeader from './SeriesHeader';
import CollectionHeader from './CollectionHeader';
import CompletedSection from './CompletedSection';

const ToysByCompanyContent = ({ rowHeight, currentToys }) => {
  if (!currentToys || currentToys.length === 0) {
    return null;
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

  const groupToysByCompany = groupToysByProperty(currentToys, "company");
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
            {Object.keys(groupToysByBrand(currentToys, company))
              .sort((a, b) => a.localeCompare(b))
              .map((brand, i) => (
                <React.Fragment key={i}>
                  {Object.keys(groupToysBySeries(currentToys, company, brand))
                    .sort((a, b) => a.localeCompare(b))
                    .map((series, i) => (
                      <React.Fragment key={i}>
                        {Object.keys(groupToysByCollection(currentToys, company, brand, series))
                          .sort((a, b) => a.localeCompare(b))
                          .map((collection, i) => (
                            <React.Fragment key={i}>
                              {Object.keys(groupToysByCompleted(currentToys, company, brand, series, collection))
                                .sort((a, b) => a.localeCompare(b))
                                .map((completed, i) => {
                                  const totalToys = groupToysByCompleted(currentToys, company, brand, series, collection)[completed].reduce((a, v) => a + v.quantity, 0);
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
                                        {groupToysByCompleted(currentToys, company, brand, series, collection)[completed].map((toy) => (
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
