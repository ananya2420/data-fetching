import { Fragment } from "react";
import path from 'path';
import fs from 'fs/promises';
import { notFound } from "next/navigation";

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  //if(!loadedProduct){
        //return <p>loading...</p>
  //}

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description || "No description available."}</p>
    </Fragment>
  );
}

async function getData(){
    const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;

 const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  if(!product){
    return {notFound:true};
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

export async function getStaticPaths() {
    const data = await getData();

    const ids=data.products.map(product =>product.id);

    const pathWithParams = ids.map(id=>({params:{pid:id}}));
  return {
    paths: pathWithParams,
     
    fallback: true,
  };
}

export default ProductDetailPage;
