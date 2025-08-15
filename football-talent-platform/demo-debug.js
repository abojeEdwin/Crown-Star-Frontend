// Demo Mode Debug Utilities
// Run these in browser console to debug demo mode issues

// Clear all demo users
function clearDemoUsers() {
  localStorage.removeItem('demoUsers')
  localStorage.removeItem('demoUser')
  console.log('Demo users cleared')
}

// View all demo users
function viewDemoUsers() {
  const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]')
  const singleUser = JSON.parse(localStorage.getItem('demoUser') || 'null')
  
  console.log('Demo users array:', demoUsers)
  console.log('Single demo user:', singleUser)
  
  return { demoUsers, singleUser }
}

// Add this to window for easy access
window.demoDebug = {
  clear: clearDemoUsers,
  view: viewDemoUsers
}

console.log('Demo debug utilities loaded. Use:')
console.log('- demoDebug.clear() to clear all demo users')
console.log('- demoDebug.view() to view current demo users')
