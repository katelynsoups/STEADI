import HomeHazards, {buttonStats} from '../src/components/HomeHazards';
import { getHazards } from '../src/data/hazardQuestions';

const HomeHazards2Page = () => {
    const hazards = getHazards(1);

    return (
        <HomeHazards questions = {hazards} next = {'/foottestinstruct'}/>
    );
};

export default HomeHazards2Page;