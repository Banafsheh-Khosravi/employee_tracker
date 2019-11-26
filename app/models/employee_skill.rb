class EmployeeSkill < ApplicationRecord
  enum proficiency: { beginner: 0, intermediate: 1, advance: 2, master: 3 }

  belongs_to :user
  belongs_to :skill
end
