import { cancelable, CancelablePromise } from '../dist/CancelablePromise';

const { expect } = global;

describe('cancelable promise', () => {
  it('should be fulfilled', () => {
    const stub = cy.stub();
    cancelable(
      new Promise((resolve) => {
        resolve(42);
      })
    ).then(stub);
    cy.wait(1).then(() => {
      expect(stub).to.be.calledOnce;
      expect(stub).to.be.calledWith(42);
    });
  });

  it('should be rejected', () => {
    const stub = cy.stub();
    cancelable(
      new Promise((resolve, reject) => {
        reject(42);
      })
    ).catch(stub);
    cy.wait(1).then(() => {
      expect(stub).to.be.calledOnce;
      expect(stub).to.be.calledWith(42);
    });
  });

  it('should cancel fulfilled promise', () => {
    const stub = cy.stub();
    const promise = new CancelablePromise((resolve) => {
      resolve(42);
    }).then(stub);
    expect(promise.isCanceled()).to.be.false;
    promise.cancel();
    expect(promise.isCanceled()).to.be.true;
    cy.wait(1).then(() => {
      expect(stub).not.to.be.called;
    });
  });

  it('should cancel rejected promise', () => {
    const stub = cy.stub();
    const promise = new CancelablePromise((resolve, reject) => {
      reject(42);
    }).catch(stub);
    expect(promise.isCanceled()).to.be.false;
    promise.cancel();
    expect(promise.isCanceled()).to.be.true;
    cy.wait(1).then(() => {
      expect(stub).not.to.be.called;
    });
  });
});
