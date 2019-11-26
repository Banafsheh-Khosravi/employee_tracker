# frozen_string_literal: true

class Skill < ApplicationRecord
  has_many :employee_skill
  has_many :users, through: :employee_skill

  validates :name, uniqueness: true
end
