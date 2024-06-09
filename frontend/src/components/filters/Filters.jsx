import React from 'react';
import { Form } from 'react-bootstrap';

const Filters = ({ filterOptions, selectedFilters, setSelectedFilters, toys }) => {
  const handleFilterChange = (filterField, value) => {
    if (filterField === 'company' && value === '') {
      // Reset all filters when "All Companies" is selected
      setSelectedFilters({ company: '', brand: '', series: '', collection: '' });
    } else {
      // Update specific filter and reset dependent filters if necessary
      setSelectedFilters(prev => ({
        ...prev,
        [filterField]: value,
        ...(filterField === 'company' && { brand: '', series: '', collection: '' })
      }));
    }
  };


  return (
    <>
    <div className="filter-section container-fluid">
        <div className="row">
          <div className="col-md-2 col-sm-12">
            <Form.Select
              size="sm"
              aria-label="Companies"
              value={selectedFilters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
            >
              <option value="">All Companies</option>
              {filterOptions.companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-2 col-sm-12">
            <Form.Select
              size="sm"
              aria-label="Brands" value={selectedFilters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            >
              <option value="">All Brands</option>
              {filterOptions.brands
                .filter((brand) => !selectedFilters.company || toys.some((toy) => toy.company === selectedFilters.company && toy.brand === brand))
                .map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </Form.Select>
          </div>
          <div className="col-md-2 col-sm-12">
            <Form.Select
              size="sm"
              aria-label="Series"
              value={selectedFilters.series}
              onChange={(e) => handleFilterChange('series', e.target.value)}
            >
              <option value="">All Series</option>
              {filterOptions.series
                .filter((series) =>
                  !selectedFilters.company ||
                  !selectedFilters.brand ||
                  toys.some(
                    (toy) =>
                      toy.company === selectedFilters.company &&
                      toy.brand === selectedFilters.brand &&
                      toy.series === series
                  )
                )
                .map((series) => (
                  // Filter out blank/empty series
                  series && (
                    <option key={series} value={series}>
                      {series}
                    </option>
                  )
                ))}
            </Form.Select>
          </div>
          <div className="col-md-2 col-sm-12">
            <Form.Select
              size="sm"
              aria-label="Collections"
              value={selectedFilters.collection}
              onChange={(e) => handleFilterChange('collection', e.target.value)}
            >
              <option value="">All Collections</option>
              {filterOptions.collections
                .filter((collection) =>
                  !selectedFilters.company ||
                  !selectedFilters.brand ||
                  toys.some(
                    (toy) =>
                      toy.company === selectedFilters.company &&
                      toy.brand === selectedFilters.brand &&
                      toy.series === selectedFilters.series &&
                      toy.collection === collection
                  )
                )
                .map((collection) => (
                  // Filter out blank/empty collections
                  collection && (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  )
                ))}
            </Form.Select>
          </div>
          <div className="col-md-2 col-sm-12">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                // Clear all selected filters
                setSelectedFilters({
                  company: '',
                  brand: '',
                  series: '',
                  collection: '',
                  completed: '',
                });
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      <div className="thumb-info container-fluid">
      <div className="d-flex"> 
        <div className="pe-5"><em>Click on a thumbnail to view information about the toy.</em></div>
        <div className="d-flex pe-5"><span className="multiple-items">2</span>&nbsp; - if more than one owned.</div>
        <div className="d-flex pe-5"><span className="new-item"><i className="fa fa-check" aria-hidden="true"></i></span>&nbsp; - newly added toy.</div>
        <div className="pe-5">Toys with the 'Variant' banner means there is more than one version of the toy.</div>
        </div>
      </div>
      </>
  );
};

export default Filters;