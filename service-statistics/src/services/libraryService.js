const fetch = require('node-fetch');
const BOOKS_URL = `${process.env.SERVICE_LIBRARY_URL}/books`;
const LOANS_URL = `${process.env.SERVICE_LIBRARY_URL}/loans`;

const fetchBooks = async (token) => {
    const response = await fetch(BOOKS_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al obtener libros del servicio Library');
    const data = await response.json();
    return data.data.books;
};

const fetchAllLoans = async (token) => {
    const response = await fetch(LOANS_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al obtener préstamos del servicio Library');
    const data = await response.json();
    return data.data.loans;
};

module.exports = { fetchBooks, fetchAllLoans };