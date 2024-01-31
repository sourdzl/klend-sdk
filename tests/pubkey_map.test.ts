import { PublicKey, Keypair } from '@solana/web3.js';
import { PubkeyHashMap, PublicKeyMap } from '../src';
import { expect } from 'chai';

const TEST_ITERATIONS = 10000;
describe('PublicKeyMap Tests', function () {
  it('benchmark_listmap', async function () {
    for (let i = 0; i < 10; i++) {
      const map = new PublicKeyMap<PublicKey, number>();
      const pubkeys: Array<[PublicKey, number]> = [];
      for (let i = 0; i < TEST_ITERATIONS; i++) {
        const pubkey = Keypair.generate().publicKey;
        pubkeys.push([pubkey, i]);
      }
      const start = performance.now();
      pubkeys.forEach(([pubkey, i]) => {
        map.set(pubkey, i);
      });
      const end = performance.now();
      const setBenchmark = end - start;
      const start2 = performance.now();
      pubkeys.forEach(([pubkey]) => {
        map.get(pubkey);
      });
      const end2 = performance.now();
      const getBenchmark = end2 - start2;
      console.log(
        `Bench #${i} LISTMAP (n=${TEST_ITERATIONS}) | SET: ${setBenchmark}ms, ${
          setBenchmark / pubkeys.length
        }ms per item | GET: ${getBenchmark}ms, ${getBenchmark / pubkeys.length}ms per item`
      );
    }
  });

  it('benchmark_hashmap', async function () {
    for (let i = 0; i < 10; i++) {
      const map = new PubkeyHashMap<PublicKey, number>();
      const pubkeys: Array<[PublicKey, number]> = [];
      for (let i = 0; i < TEST_ITERATIONS; i++) {
        const pubkey = Keypair.generate().publicKey;
        pubkeys.push([pubkey, i]);
      }
      const start = performance.now();
      pubkeys.forEach(([pubkey, i]) => {
        map.set(pubkey, i);
      });
      const end = performance.now();
      const setBenchmark = end - start;
      const start2 = performance.now();
      pubkeys.forEach(([pubkey]) => {
        map.get(pubkey);
      });
      const end2 = performance.now();
      const getBenchmark = end2 - start2;
      console.log(
        `Bench #${i} HASHMAP (n=${TEST_ITERATIONS}) | SET: ${setBenchmark}ms, ${
          setBenchmark / pubkeys.length
        }ms per item | GET: ${getBenchmark}ms, ${getBenchmark / pubkeys.length}ms per item`
      );
    }
  });

  it('test_listmap', async function () {
    const map = new PubkeyHashMap<PublicKey, number>();
    const pubkeys: Array<[PublicKey, number]> = [];
    expect(map.isEmpty()).to.be.true;
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const pubkey = Keypair.generate().publicKey;
      pubkeys.push([pubkey, i]);
      pubkeys.push([pubkey, i]);
    }
    pubkeys.forEach(([pubkey, i]) => {
      map.set(pubkey, i);
    });
    pubkeys.forEach(([pubkey, i]) => {
      expect(map.get(pubkey)).eq(i);
    });
    pubkeys.forEach(([pubkey, i]) => {
      const containsEntry = [...map.entries()].find(([key]) => {
        return key.equals(pubkey);
      });
      expect(containsEntry).to.not.be.undefined;
      expect(containsEntry![1]).eq(i);
    });
    pubkeys.forEach(([pubkey]) => {
      const containsKey = [...map.keys()].find((key) => {
        return key.equals(pubkey);
      });
      expect(containsKey).to.not.be.undefined;
      expect(containsKey!.equals(pubkey)).true;
    });
    pubkeys.forEach(([, i]) => {
      const containsValue = [...map.values()].find((value) => {
        return value === i;
      });
      expect(containsValue).to.not.be.undefined;
      expect(containsValue).eq(i);
    });
    expect(map.isEmpty()).to.be.false;
    pubkeys.forEach(([pubkey]) => {
      map.delete(pubkey);
    });
    expect(map.isEmpty()).to.be.true;
    expect(map.size).eq(0);
  });

  it('test_hashmap', async function () {
    const map = new PubkeyHashMap<PublicKey, number>();
    const pubkeys: Array<[PublicKey, number]> = [];
    expect(map.isEmpty()).to.be.true;
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const pubkey = Keypair.generate().publicKey;
      pubkeys.push([pubkey, i]);
      pubkeys.push([pubkey, i]);
    }
    pubkeys.forEach(([pubkey, i]) => {
      map.set(pubkey, i);
    });
    pubkeys.forEach(([pubkey, i]) => {
      expect(map.get(pubkey)).eq(i);
    });
    pubkeys.forEach(([pubkey, i]) => {
      const containsEntry = [...map.entries()].find(([key]) => {
        return key.equals(pubkey);
      });
      expect(containsEntry).to.not.be.undefined;
      expect(containsEntry![1]).eq(i);
    });
    pubkeys.forEach(([pubkey]) => {
      const containsKey = [...map.keys()].find((key) => {
        return key.equals(pubkey);
      });
      expect(containsKey).to.not.be.undefined;
      expect(containsKey!.equals(pubkey)).true;
    });
    pubkeys.forEach(([, i]) => {
      const containsValue = [...map.values()].find((value) => {
        return value === i;
      });
      expect(containsValue).to.not.be.undefined;
      expect(containsValue).eq(i);
    });
    expect(map.isEmpty()).to.be.false;
    pubkeys.forEach(([pubkey]) => {
      map.delete(pubkey);
    });
    expect(map.isEmpty()).to.be.true;
    expect(map.size).eq(0);
  });
});
