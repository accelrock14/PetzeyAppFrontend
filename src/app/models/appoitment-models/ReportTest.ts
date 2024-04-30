import { Test } from "./Test";


export interface ReportTest {
    ReportTestID: number;
    TestID: number;
    Test: Test | null;
}
