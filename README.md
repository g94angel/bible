View deployed app here: https://rcv.netlify.app/

This is a tool to help users find verses in the Bible. This app was made with the Text Only Holy Bible Recovery Version API.

Below are some instructions for using the app. Enjoy!

The use of Alphabets and Numbers
A general rule to observe when constructing a valid input string is that whereas book names may include alphabets and numbers, book chapters and verse numbers can include only Arabic numerals. Hence, while the reference:
Hebrews 1:4 is valid,
Hebrews I.IV is not valid,
Hebrews I:IV is not valid, and
Hebrews I,IV is not valid.

The use of Periods, Commas, and Semicolons
The API also understands periods, commas, and semicolons in a specific way.

The period is allowed only for book name abbreviations. For instance:

Matt. 28:19 is valid, but
Matt. 28.19 is not valid
The semicolon is used either for the separation of two or more full references or for references within the same book but in different chapters. For instance:

Prov. 29:18; Acts 26:19 is valid, and
Acts 9:22; 26:19 is valid
The comma is allowed only for additional verse citations within the same book and chapter. Some examples are:

John 1:1, 14
Heb. 1:2, 5-6, 8
Note: Be careful not to switch semicolons for commas and vice versa.

As you may have observed in the examples above, the colon is used only to separate verse numbers and chapter numbers.

Based on the overview above, a simple input string will consist of only alphabets, numbers, and colons. Examples include:

Acts 13:13
Jude 9
Eph. 4:6-4

and a complex input string may consist of all allowed character sets. For instance:

Prov. 29:18; Acts 26:19
Prov. 29:18; Acts 26:19; John 1:12-13, 16
A final note regarding single chapter books is that they are to be referenced as though they contained only verses. For instance:

Jude 9 is valid, but
Jude 1:9 is not valid.
