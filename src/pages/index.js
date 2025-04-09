import path from 'path';
import fs from 'fs/promises';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

export default function Home(props) {
  const { products } = props;

  return (
    <ul>
      {products.length > 0 ? (
        products.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>{product.title}</Link>
            </li>
        ))
      ) : (
        <p>No products found!</p>
      )}
    </ul>
  );
}

export async function getStaticProps(context) {
  console.log('(Re)Generating...');

  try {
    // Get the file path for the JSON data
    const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
    
    // Check if the file path is correct (debugging step)
    console.log('File path:', filePath);

    // Ensure the file exists
    await fs.access(filePath); // This ensures the file exists before proceeding

    // Read the file as a string
    const jsonData = await fs.readFile(filePath, 'utf-8');
    
    // Parse the JSON data
    const data = JSON.parse(jsonData);

    if(!data){
      return{
        redirect:{
          destnation:'/no-data'
        }
      }
    }

    if(data.products.length===0){
      return {notFound:true};
    }

    // Return the products as props
    return {
      props: {
        products: data.products || [], // Safeguard against missing "products" key
      },
      revalidate: 10, // Revalidate the page after 10 seconds (optional)
    };
  } catch (error) {
    console.error('Error reading or parsing the JSON file:', error);

    // Return empty products in case of error
    return {
      props: {
        products: [],
      },
      revalidate: 10, 

      
    };
  }
}
