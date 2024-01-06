const {
    checkStudentName
} = require("../../helpers/endPointHelpers.js");

//table.string('first_name').notNullable();
//table.string('last_name').notNullable();
//table.integer('age').notNullable();
//table.string('email').unique().notNullable();

test("check name", () => {

    expect(checkStudentName("")).toBe(false);
    expect(checkStudentName(null)).toBe(false);
    expect(checkStudentName("i")).toBe(false);
    expect(checkStudentName(1)).toBe(false);
    expect(checkStudentName("dfhsjkhqdskjlhqfsjkhgklfshgflkshkgfshfkjdhfkjskfhjqkdfjhqkdfhgkdfhgkfdlhgkfdlqgfdlqh")).toBe(false);

    expect(checkStudentName("bilal")).toBe(true);
    expect(checkStudentName("roda hilal")).toBe(true);
})