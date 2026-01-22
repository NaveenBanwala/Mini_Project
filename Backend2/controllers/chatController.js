exports.getContacts = async (req, res) => {
    res.json([]); // Return empty array for now
};

exports.getHistory = async (req, res) => {
    res.json([]); // Return empty array for now
};

exports.sendMessage = async (req, res) => {
    res.status(201).json({ message: "Message sent" });
};

exports.markAsRead = async (req, res) => {
    res.json({ message: "Read" });
};