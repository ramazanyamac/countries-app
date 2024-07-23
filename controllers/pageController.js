import fetch from "node-fetch";

const getIndexPage = async (req, res) => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();

        const searchQuery = req.query.search || '';
        const regionFilter = req.query.region || '';
        const filteredCountries = countries.filter(country => 
            (country.name.common.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (regionFilter === '' || country.region === regionFilter)
        );

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        const totalPages = Math.ceil(filteredCountries.length / limit);

        if (endIndex < filteredCountries.length) {
            results.next = {
                page: page + 1,
                limit: limit,
                search: searchQuery,
                region: regionFilter
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
                search: searchQuery,
                region: regionFilter
            };
        }

        results.total = filteredCountries.length;
        results.totalPages = totalPages;
        results.countries = filteredCountries.slice(startIndex, endIndex);

        res.render('index', { 
            countries: results.countries,
            pagination: results,
            currentPage: page,
            searchQuery,
            regionFilter
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};

export { getIndexPage };
