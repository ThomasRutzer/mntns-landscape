import { Container } from "inversify";
import TYPES from "./types";
import { GeneratorManager } from "./../generator";
import GeneratorManagerInterface from "./../generator/manager/GeneratorManagerInterface";

const DIContainer = new Container();
// DIContainer.bind<GeneratorManagerInterface>(TYPES.GeneratorManager).to(GeneratorManager);

export { DIContainer };