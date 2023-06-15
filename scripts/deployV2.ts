

async function main() {



/*@Dev Throu Puedes utilizar este script como referencia para actualizar la logica de
implementacion del contrato V1 a V2
*/

const PROXY = "0x89FAfa1fE9bceED7c4B88Db04B77aAdB2584A5C8"; //PROXY OF CONTRACT DEPLOYED (ProjectAdminV1)


  console.log("Upgrading...");
  const CTV2 = await ethers.getContractFactory("CertiBitsV2");
  const ctv2 = await upgrades.upgradeProxy(PROXY, CTV2 );

 await ctv2.deployed();
 console.log("Upgraded in" + ctv2.address );

 console.log(await ctv2.version());

}


main();