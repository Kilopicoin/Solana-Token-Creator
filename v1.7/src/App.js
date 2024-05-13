import React, { useState, useEffect } from 'react';
import './App.css';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import {
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  ExtensionType,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
  mintTo,
  createAssociatedTokenAccount,
  transfer,
  setAuthority,
  AuthorityType
} from '@solana/spl-token';
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';


function App() {

  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState('');
  const [consoleNote, setconsoleNote] = useState('No Progress, Console Waiting');
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  


  const payer = Keypair.generate();

  // Check if the pk is correct 
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const mint = Keypair.generate();

  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );


  useEffect(() => {
    if (window.solana) {
      setPhantomInstalled(true);
    }
  }, []);



  const mintTokens = async () => {

    await window.solana.connect();
   

    try {
      // Connect to Solana network
  
      // Get the public key of the recipient's wallet

  
      // Construct the transaction
      const transaction = new Transaction().add(
        // Add instruction to transfer SOL
        SystemProgram.transfer({
          fromPubkey: window.solana.publicKey,
          toPubkey: payer.publicKey,
          lamports: 0.4 * 10 ** 9, // Amount in SOL (1 SOL = 10^9 lamports)
        })
      );

      transaction.feePayer = window.solana.publicKey; // Set the fee payer
  
      const recentBlockhash = await connection.getRecentBlockhash();
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

    try {

    
  const mintTransaction = new Transaction().add(
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


  const signature = await sendAndConfirmTransaction(connection, mintTransaction, [payer, mint]);
  


  setconsoleNote("Transaction confirmed with signature");
  setconsoleNote("Tokens minted successfully!");
    console.log("Transaction confirmed with signature:", signature);
    console.log("Tokens minted successfully!");

    await connection.confirmTransaction(signature);
   
    const mintBS58 = mint.publicKey.toBase58();
    console.log("Mint Address:", mintBS58);

  

    


    await mintXTokens();

    await getRemainingSOLBalance();


  } catch (error) {
    setconsoleNote("Error minting tokens, please refresh the page");
    console.error("Error minting tokens:", error);
  }




 





  }




  const mintXTokens = async () => {


    const tokenAccount = await createAssociatedTokenAccount(
      connection,
      payer,
      mint.publicKey,
      payer.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
    
    const tokenSupplyX = parseInt(tokenSupply) * 10 ** tokenDecimals;


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
    

    try {

      // Get the token account of the recipient (window.solana.publicKey)

      const recipientTokenAccount = await createAssociatedTokenAccount(
        connection,
        payer,
        mint.publicKey,
        window.solana.publicKey,
        undefined,
        TOKEN_2022_PROGRAM_ID,
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )
      
      // Transfer tokens from the payer's associated token account to the recipient's associated token account
  
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

    } catch (error) {
      setconsoleNote('Error transferring tokens, please refresh the page');
      console.error('Error transferring tokens:', error);
    }
 

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
  
      const recentBlockhash = await connection.getRecentBlockhash();
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
          <p className='small-text'>( 0.4 SOL )</p></button>
          
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