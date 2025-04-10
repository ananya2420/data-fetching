// pages/last-sales.js

import { useEffect, useState } from 'react';
import useSWR from 'swr';

// SWR fetcher
const fetcher = (url) => fetch(url).then((res) => res.json());

function LastSalesPage(props) {
    const [sales, setSales] = useState(props.sales);

    const { data, error } = useSWR(
        'https://data-fetching-7ebfc-default-rtdb.firebaseio.com/sales.json',
        fetcher
    );

    useEffect(() => {
        if (data) {
            const transformedSales = [];

            for (const key in data) {
                transformedSales.push({
                    id: key,
                    username: data[key].username,
                    volume: data[key].volume,
                });
            }

            setSales(transformedSales);
        }
    }, [data]);

    if (error) {
        return <p>NO data yet</p>;
    }

    if (!sales) {
        return <p>Loading...</p>;
    }

    return (
        <ul>
            {sales.map((sale) => (
                <li key={sale.id}>
                    {sale.username} - ${sale.volume}
                </li>
            ))}
        </ul>
    );
}

export async function getStaticProps() {
    const res = await fetch('https://data-fetching-7ebfc-default-rtdb.firebaseio.com/sales.json');
    const data = await res.json();

    const transformedSales = [];

    for (const key in data) {
        transformedSales.push({
            id: key,
            username: data[key].username,
            volume: data[key].volume,
        });
    }

    return {
        props: {
            sales: transformedSales,
        },
        revalidate: 10, // Re-generate page at most every 10 seconds
    };
}

export default LastSalesPage;
