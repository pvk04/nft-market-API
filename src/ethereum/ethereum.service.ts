import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class EthereumService {
  private web3: Web3;

  constructor() {
    // Подключение к узлу Ethereum (ноде)
    this.web3 = new Web3(
      new Web3.providers.HttpProvider('http://localhost:8545'),
    );
  }

  async getContractData<T>(
    contractAddress: string,
    abi: any,
    methodName: string,
    params: any[] = [],
  ): Promise<T> {
    const contract = new this.web3.eth.Contract(abi, contractAddress);
    const result = await contract.methods[methodName](...params).call();
    return result as T;
  }
}
