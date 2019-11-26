json.user @user, :id, :full_name, :role, :email
json.skills do
  json.array! @user.skills do |skill|
    json.id skill.id
    json.name skill.name.capitalize
    json.desc skill.desc.capitalize
    json.proficiency EmployeeSkill.where(user_id: @user.id, skill_id: skill.id).first.proficiency.capitalize
  end
end