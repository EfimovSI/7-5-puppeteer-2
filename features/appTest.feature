Feature: Application tests

#   Scenario: Should buy ticket in 5 days advance
#     Given User is on 'http://qamid.tmweb.ru/client/index.php' page
#     When User clicks button # 6 of calendar
#     And User clicks on 1-st movie seance's time button
#     And User clicks on chosen 'seat'
#     And User clicks on "Забронировать" button
#     Then User sees chosen 'seat'
#     When User clicks on button 'Получить код бронирования'
#     Then User get 'Электронный билет'

#   Scenario: Should buy 3 random tickets for tomorrow
#     Given User is on 'http://qamid.tmweb.ru/client/index.php' page
#     When User clicks button # 2 of calendar
#     And User clicks on 1-st movie seance's time button
#     And User clicks on chosen 'seat'
#     And User clicks on chosen 'seat'
#     And User clicks on chosen 'seat'
#     And User clicks on "Забронировать" button
#     Then User sees chosen 'seats'
#     When User clicks on button 'Получить код бронирования'
#     Then User get 'Электронный билет'

    Scenario: Should not let buy ticket without choosing a seat
    Given User is on 'http://qamid.tmweb.ru/client/index.php' page
    When User clicks button # 3 of calendar
    And User clicks on 1-st movie seance's time button
    Then Button Забронировать is 'disabled'