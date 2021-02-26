const { AbilityBuilder, Ability } = require("@casl/ability");

const policies = {
  admin(user, { can }) {
    can("manage", "all");
  },
  user(user, { can }) {
    can("view", "Product");
    can("create", "Order");
    can("read", "Order", { user_id: user._id });
    can("read", "Cart", { user_id: user._id });
    can("update", "Cart", { user_id: user.id });
  },
};

function policyFor(user) {
  let builder = new AbilityBuilder();
  if (policies[user.role]) {
    policies[user.role](user, builder);
  }
  return new Ability(builder.rules);
}

module.exports = { policyFor };
