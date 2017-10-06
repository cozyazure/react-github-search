import DataBank from "../databank";

it('should be able to provide the initial-data from the databank', () => {
    expect(DataBank.users).toBeTruthy();
    expect(DataBank.users.length).toBeTruthy();
});