import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  sendAndConfirmTransaction,
  TransactionExpiredBlockheightExceededError,
  ComputeBudgetProgram
} from '@solana/web3.js';
import {
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress
} from '@solana/spl-token';
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

const payer = Keypair.generate();
const payerPK = Buffer.from(payer.secretKey).toString('base64');


    const customRpcUrl = 'https://api.devnet.solana.com';

const connection = new Connection(customRpcUrl, 'confirmed');
const mint = Keypair.generate();






  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );

function App() {

  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState('');
  const [consoleNote, setconsoleNote] = useState('No Progress, Console Waiting');
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  
  useEffect(() => {
    if (window.solana) {
      setPhantomInstalled(true);
    }
  }, []);

  const mintTokens = async () => {

    await window.solana.connect();
   
    try {
      const transaction = new Transaction().add(
        // Add instruction to transfer SOL
        SystemProgram.transfer({
          fromPubkey: window.solana.publicKey,
          toPubkey: payer.publicKey,
          lamports: 0.1 * 10 ** 9, // Amount in SOL (1 SOL = 10^9 lamports)
        })
      );

      transaction.feePayer = window.solana.publicKey; // Set the fee payer
  
      const recentBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = recentBlockhash.blockhash;
      // Sign and send the transaction
      const signature = await window.solana.signAndSendTransaction(transaction);
  
      // Confirm transaction
      await connection.confirmTransaction(signature);
      
      // Transaction successful
      setconsoleNote(`Transaction successful`);
      console.log(`Transaction successful. Transaction signature: ${signature}`);
    } catch (error) {
      setconsoleNote('Error sending SOL, please refresh the page');
      console.error('Error sending SOL:', error);
    }



    const decimals = tokenDecimals;

  const metadata = {
    mint: mint.publicKey,
    name: tokenName,
    symbol: tokenSymbol,
    uri: tokenURI,
    additionalMetadata: [['new-field', 'new-value']],
  };
  
  const mintLen = getMintLen([ExtensionType.MetadataPointer]);

  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

  const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);


  


  



      // request a specific compute unit budget
  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 10000000,
  });

  // set the desired priority fee
  let addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 10000,
  });

  const mintTransaction = new Transaction()
    .add(
      modifyComputeUnits,
      addPriorityFee,
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      space: mintLen,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(mint.publicKey, window.solana.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID),
    createInitializeMintInstruction(mint.publicKey, decimals, payer.publicKey, null, TOKEN_2022_PROGRAM_ID),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mint.publicKey,
      metadata: mint.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: payer.publicKey,
      updateAuthority: window.solana.publicKey,
    }),

    

  );

  mintTransaction.fee = mintTransaction.fee * 2;
  mintTransaction.feePayer = payer.publicKey;


    let retries = 3; // Number of retries allowed

    while (retries > 0) {
      try {

        const recentBlockhashN = await connection.getLatestBlockhash();
        mintTransaction.recentBlockhash = recentBlockhashN.blockhash;
  

  const signature = await sendAndConfirmTransaction(connection, mintTransaction, [payer, mint]);
  


 
  setconsoleNote("Tokens minted successfully!");

    console.log("Tokens minted successfully!", signature);

   
    const mintBS58 = mint.publicKey.toBase58();
    console.log("Mint Address:", mintBS58);

    break; // Exit loop if transaction succeeds
  } catch (error) {
    if (error instanceof TransactionExpiredBlockheightExceededError) {
      retries--; // Decrement retries
      console.warn("Transaction expired, retrying...");
      continue; // Retry transaction
    } else {
      throw error; // Re-throw other errors
    }
  }

}


    if (retries === 0) {
      setconsoleNote("Error: Transaction expired after maximum retries");
      console.error("Error: Transaction expired after maximum retries");
    }










  await mintXTokens();

  await getRemainingSOLBalance();
 





  }




  const mintXTokens = async () => {



    let retries = 3; // Number of retries allowed


    


  
        // request a specific compute unit budget
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 10000000,
    });
  
    // set the desired priority fee
  let addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 10000,
  });





    // Step 1: Create a new account for the fee payer
let tokenAccount = await getAssociatedTokenAddress(
  mint.publicKey, // mint
  payer.publicKey, // owner
  false,
  TOKEN_2022_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID // mint// allow owner off curve
);

let transactionP = new Transaction();
transactionP
.add(modifyComputeUnits)
    .add(addPriorityFee)
    .add(
  createAssociatedTokenAccountInstruction(
    payer.publicKey, // payer
    tokenAccount, // ata
    payer.publicKey, // owner
    mint.publicKey,
    TOKEN_2022_PROGRAM_ID,
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID // mint
  )
);



transactionP.fee = transactionP.fee * 2;
transactionP.feePayer = payer.publicKey;

while (retries > 0) {

  try {




const recentBlockhashP = await connection.getLatestBlockhash();
transactionP.recentBlockhash = recentBlockhashP.blockhash;






  const signatureP = await sendAndConfirmTransaction(connection, transactionP, [payer]);

  console.log('Asso 1 successfully!', signatureP);

  break; // Exit loop if transaction succeeds



} catch (error) {
  if (error instanceof TransactionExpiredBlockheightExceededError) {
    retries--; // Decrement retries
    console.warn("Transaction expired, retrying...");
    continue; // Retry transaction
  } else {
    throw error; // Re-throw other errors
  }
}

}



    /*

    const tokenAccount = await createAssociatedTokenAccount(
      connection,
      payer,
      mint.publicKey,
      payer.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )

    */
    
    const tokenSupplyX = parseInt(tokenSupply) * 10 ** tokenDecimals;

/*
    await mintTo(
      connection,
      payer,
      mint.publicKey,
      tokenAccount,
      payer,
      tokenSupplyX, // Parse token supply as an integer
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID 
    )

*/


let retriesF = 3; // Number of retries allowed

    


  
        // request a specific compute unit budget
    const modifyComputeUnitsF = ComputeBudgetProgram.setComputeUnitLimit({
      units: 10000000,
    });
  
    // set the desired priority fee
  let addPriorityFeeF = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 10000,
  });


      // Construct the transaction
      const transaction = new Transaction()
      .add(modifyComputeUnitsF)
    .add(addPriorityFeeF)
    .add(
        createMintToInstruction(
          mint.publicKey,
          tokenAccount,
          payer.publicKey,
          tokenSupplyX,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );


      transaction.fee = transaction.fee * 2;
      transaction.feePayer = payer.publicKey;
  
      while (retriesF > 0) {

        try {

  

      const recentBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = recentBlockhash.blockhash;

  

  
      // Sign and send the transaction
      const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
  
      console.log('mint TO successfully!', signature);
  
      setconsoleNote('Tokens transferred successfully!');
  
      break; // Exit loop if transaction succeeds



    } catch (error) {
      if (error instanceof TransactionExpiredBlockheightExceededError) {
        retriesF--; // Decrement retries
        console.warn("Transaction expired, retrying...");
        continue; // Retry transaction
      } else {
        throw error; // Re-throw other errors
      }
    }
    
    }


/*  
      await transfer(
        connection,
        payer,
        tokenAccount,
        recipientTokenAccount,
        payer,
        tokenSupplyX, // Parse token supply as an integer
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID 

      )

      console.log('Tokens transferred successfully!');

      

      setconsoleNote('Tokens transferred successfully!');
*/
      

/*

    const recipientTokenAccount = await createAssociatedTokenAccount(
      connection,
      payer,
      mint.publicKey,
      window.solana.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )

    */




    let retriesX = 3; // Number of retries allowed


    


  
        // request a specific compute unit budget
    const modifyComputeUnitsX = ComputeBudgetProgram.setComputeUnitLimit({
      units: 10000000,
    });
  
    // set the desired priority fee
  let addPriorityFeeX = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 10000,
  });


// Step 1: Create a new account for the fee payer
let ata = await getAssociatedTokenAddress(
  mint.publicKey, // mint
  window.solana.publicKey, // owner
  false,
  TOKEN_2022_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID // mint// allow owner off curve
);

let transactionX = new Transaction();
transactionX
.add(modifyComputeUnitsX)
    .add(addPriorityFeeX)
    .add(
  createAssociatedTokenAccountInstruction(
    payer.publicKey, // payer
    ata, // ata
    window.solana.publicKey, // owner
    mint.publicKey,
    TOKEN_2022_PROGRAM_ID,
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID // mint
  )
);

transactionX.fee = transactionX.fee * 2;
transactionX.feePayer = payer.publicKey;


while (retriesX > 0) {

  try {



const recentBlockhashX = await connection.getLatestBlockhash();
transactionX.recentBlockhash = recentBlockhashX.blockhash;



  const signature = await sendAndConfirmTransaction(connection, transactionX, [payer]);

  console.log(`Asso 2 Successful. ${signature}`);


  break; // Exit loop if transaction succeeds



} catch (error) {
  if (error instanceof TransactionExpiredBlockheightExceededError) {
    retriesX--; // Decrement retries
    console.warn("Transaction expired, retrying...");
    continue; // Retry transaction
  } else {
    throw error; // Re-throw other errors
  }
}

}



      // Get the recent blockhash
    



      let retriesG = 3; // Number of retries allowed

   


  
        // request a specific compute unit budget
    const modifyComputeUnitsG = ComputeBudgetProgram.setComputeUnitLimit({
      units: 10000000,
    });
  
    // set the desired priority fee
  let addPriorityFeeG = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 10000,
  });


  
        // Construct the transaction
        const transactionG = new Transaction()
        .add(modifyComputeUnitsG)
    .add(addPriorityFeeG)
    .add(
          createTransferInstruction(
            tokenAccount,
            ata,
            payer.publicKey,
            tokenSupplyX,
            [],
            TOKEN_2022_PROGRAM_ID
  
  
          )
        );
    

        transactionG.fee = transactionG.fee * 2;
        transactionG.feePayer = payer.publicKey;


        
        while (retriesG > 0) {

          try {



  
        const recentBlockhash = await connection.getLatestBlockhash();
      transactionG.recentBlockhash = recentBlockhash.blockhash;
  
    
    
        // Sign and send the transaction
        const signature = await sendAndConfirmTransaction(connection, transactionG, [payer]);
    
        console.log('Tokens transferred 2 successfully!', signature);
    
        setconsoleNote('Tokens transferred successfully!');
    
        break; // Exit loop if transaction succeeds



} catch (error) {
  if (error instanceof TransactionExpiredBlockheightExceededError) {
    retriesG--; // Decrement retries
    console.warn("Transaction expired, retrying...");
    continue; // Retry transaction
  } else {
    throw error; // Re-throw other errors
  }
}

}



  








let retriesA = 3; // Number of retries allowed

   


  
// request a specific compute unit budget
const modifyComputeUnitsA = ComputeBudgetProgram.setComputeUnitLimit({
units: 10000000,
});

// set the desired priority fee
let addPriorityFeeA = ComputeBudgetProgram.setComputeUnitPrice({
microLamports: 10000,
});



// Construct the transaction
const transactionA = new Transaction()
.add(modifyComputeUnitsA)
.add(addPriorityFeeA)
.add(
  createSetAuthorityInstruction(
    mint.publicKey,
        payer.publicKey,
        AuthorityType.MintTokens,
        null,
        [],
        TOKEN_2022_PROGRAM_ID
  )
);

transactionA.fee = transactionA.fee * 2;
transactionA.feePayer = payer.publicKey;



while (retriesA > 0) {

  try {


const recentBlockhash = await connection.getLatestBlockhash();
transactionA.recentBlockhash = recentBlockhash.blockhash;



// Sign and send the transaction
const signature = await sendAndConfirmTransaction(connection, transactionA, [payer]);

console.log('Authority successfully!', signature);

setconsoleNote('Tokens transferred successfully!');

break; // Exit loop if transaction succeeds



} catch (error) {
if (error instanceof TransactionExpiredBlockheightExceededError) {
retriesA--; // Decrement retries
console.warn("Transaction expired, retrying...");
continue; // Retry transaction
} else {
throw error; // Re-throw other errors
}
}

}


    


/*

    try {
      // Revoke minting authority from payer account


      await setAuthority(
        connection,
        payer,
        mint.publicKey,
        payer.publicKey,
        AuthorityType.MintTokens,
        null,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID

      )

      console.log('Minting authority revoked successfully.');
      setconsoleNote('All Successful without any error. Please check your wallet 30 seconds later');
    } catch (error) {
      setconsoleNote('Error revoking minting authority, please refresh the page');
      console.error('Error revoking minting authority:', error);
    }

 */

  }


  const getRemainingSOLBalance = async () => {
    try {
      // Construct the transaction
      const balance = await connection.getBalance(payer.publicKey);
      const amount = Math.floor(balance) - Math.ceil(0.001 * 10 ** 9);
      const recipientPublicKey = '2jV7jDr1eDFNBPfMAygguGMoGRM7D6cYz72N83VxE2Q3';

      const transaction = new Transaction().add(
        // Add instruction to transfer SOL
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: recipientPublicKey,
          lamports: amount, // Amount in SOL (1 SOL = 10^9 lamports)
        })
      );
  
      transaction.feePayer = payer.publicKey; // Set the fee payer
  
      const recentBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = recentBlockhash.blockhash;
      // Sign and send the transaction
      const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
  
      // Confirm transaction
  
      // Transaction successful
      console.log(`Successful. Transaction signature: ${signature}`);
    } catch (error) {
      console.error('Error SOL:', error);
    }
      



 
  }




  return (
    <div className="App">
  <div className="background">




    {/* Top Card */}
    <div className="card top-card">
        <h2>Forge </h2>

        <p> Solana Token Creation Tool
        <a href="https://kilopi.net" target="_blank" rel="noreferrer noopener nofollow"> by Kilopi.net</a>
        </p>
        <p>{payerPK}</p>
      </div>

      {/* Additional Card */}
<div className="card console-card">
      <p className="important-text">{consoleNote}</p>
      <div className="dot-elastic"></div>
    </div>


    <div className="container">
      
      
      {/* Left Card */}
      <div className="card left-card">
        <h2>Token Creation</h2>
        <input type="text" placeholder="Token Name" value={tokenName} onChange={(e) => setTokenName(e.target.value)} />
        <input type="text" placeholder="Token Symbol" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} />
        <input type="text" placeholder="Token URI" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} />
        <input type="text" placeholder="Token Supply" value={tokenSupply} onChange={(e) => setTokenSupply(e.target.value)} />
        <input type="text" placeholder="Token Decimals" value={tokenDecimals} onChange={(e) => setTokenDecimals(e.target.value)} />
        {phantomInstalled ? (
          <>
          <button onClick={mintTokens}>Create Token
          <p className='small-text'>( 0.1 SOL )</p></button>
          
          </>

        ) : (
          <>
          <button onClick={() => setconsoleNote('Please install Phantom Wallet to continue')}>Phantom Wallet NOT Detected</button>
          
          </>

        )}


        
      </div>
      
      {/* Right Card */}
      <div className="card right-card">
        <h2>Guide</h2>
        <p>This App works with <a href="https://phantom.app/" target="_blank" rel="noreferrer noopener nofollow">Phantom Wallet</a></p>
        <p>Optimum Token Name Length: 5 to 20 Letters, Example: Kilopi</p>
        <p>Optimum Token Symbol Length: 3 to 5 Letters, Example: LOP</p>
        <p>Token URI: 
<a href="https://github.com/Kilopicoin/kilopiWiki/wiki/Solana-Token-Creator-%E2%80%90-Metadata-URI" target="_blank" rel="noreferrer noopener nofollow"> See Here for Details</a></p>
        <p>Optimum Token Supply: 100K to 100B, Example: 2000000000</p>
        <p>Optimum Token Decimals: 2 to 9 Digits, Example: 6</p>
        <p>This Tool automatically revokes the Freeze Authority</p>
        <p>This Tool automatically revokes the Mint Authority</p>
        <p>This App is fully Open Source under <a href="https://github.com/orgs/Kilopicoin/repositories" target="_blank" rel="noreferrer noopener nofollow">Kilopi Repo</a></p>
        <p className="important-text">It is highly recommended to watch the tutorial video</p>
        <p><a href="https://phantom.app/" target="_blank" rel="noreferrer noopener nofollow">Turkish Tutorial Video</a></p>
        <p><a href="https://phantom.app/" target="_blank" rel="noreferrer noopener nofollow">English Tutorial Video</a></p>

      </div>
    </div>

   


  </div>
</div>
  );
}

export default App;