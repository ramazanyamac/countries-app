import fetch from "node-fetch";

const getAllCountries = async (req, res) => {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();

        const searchQuery = req.query.search || "";
        const filteredCountries = countries.filter((country) =>
            country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < filteredCountries.length) {
            results.next = {
                page: page + 1,
                limit: limit,
                search: searchQuery,
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
                search: searchQuery,
            };
        }

        results.total = filteredCountries.length;
        results.totalPages = Math.ceil(filteredCountries.length / limit);
        results.countries = filteredCountries.slice(startIndex, endIndex);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};

const getCountry = async (req, res) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${req.params.name}`);
        const country = await response.json();
        res.status(200).render("country", {
            country: { ...country[0] },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};

export { getAllCountries, getCountry };
