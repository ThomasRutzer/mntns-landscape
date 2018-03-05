import { Container } from "inversify";
import { expect } from 'chai'

import diContainer from './container';

describe('DI Container', () => {
    it('is an instance of inversify Container', () => {
        expect(diContainer).to.be.instanceOf(Container);
    })
});